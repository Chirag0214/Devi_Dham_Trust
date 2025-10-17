// Backend/server.js (Using MySQL/mysql2 for Permanent Storage)

// ==========================================================
// 🚨 CRITICAL: .ENV FILE LOAD KAREIN (Sabse Pehle)
// ==========================================================
require('dotenv').config(); 
// Native fetch support ke liye, agar Node.js 18+ use kar rahe hain toh yeh zaroori nahi, 
// warna 'node-fetch' import karna padega. Hum native 'fetch' use karenge.
// ==========================================================

const express = require('express');
const cors = require('cors');
const multer = require('multer'); 
const mysql = require('mysql2/promise');
const path = require('path'); 
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid'); // Unique Order ID ke liye

const app = express();
// Environment Variables se values lena
const PORT = process.env.PORT || 3000;
const saltRounds = 10; 
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_devidhaam'; // 🛑 .env se load hoga

// 🛑 MySQL credentials .env se load karein
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',      
    user: process.env.DB_USER || 'root',           
    password: process.env.DB_PASSWORD || '',           
    database: process.env.DB_NAME || 'devidhaam'   
};

// 🛑 Cashfree Credentials .env se load karein
const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET;
const CASHFREE_BASE_URL = process.env.CASHFREE_BASE_URL || 'https://sandbox.cashfree.com/pg';
const DOMAIN_URL = process.env.DOMAIN_URL || 'http://localhost:3000'; // Frontend URL for redirects


// --- DATABASE CONNECTION POOL ---
let dbPool;
try {
    dbPool = mysql.createPool(dbConfig);
    console.log('✅ MySQL Pool created successfully.');
} catch (error) {
    console.error('❌ Failed to create MySQL Pool. Check XAMPP/MySQL status:', error);
    process.exit(1);
}

// ==========================================================
//                 SETUP & MIDDLEWARE (CRITICAL: Order Matters!)
// ==========================================================
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// ... rest of the setup and logging middleware remains the same ...

// --- MAILER TRANSPORTER (uses env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_SECURE) ---
const createMailerTransport = () => {
    // Ye saare variables ab process.env se load honge
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = process.env.SMTP_SECURE === 'true';
    const fromAddress = process.env.SMTP_FROM || 'no-reply@devidhaam.org';

    if (!host || !user || !pass) {
        console.warn('[WARN] SMTP credentials not fully configured. /api/admin/reply will fail until env vars are set.');
    }

    return nodemailer.createTransport({
        host: host || 'smtp.example.com',
        port: port,
        secure: secure, 
        auth: user && pass ? { user, pass } : undefined,
    });
};

// ... Multer config (galleryStorage, uploadGallery, projectStorage, uploadProject) remains the same ...

// --- AUTHENTICATION MIDDLEWARE (JWT_SECRET ab process.env se aayega) --- 
const authenticateToken = async (req, res, next) => {
    // ... JWT verification code remains the same, using the global JWT_SECRET ...
    // try { const payload = jwt.verify(token, JWT_SECRET); ... }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Authentication token missing. Please log in.' });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        // ... rest of DB check ...
        next();
    } catch (err) {
        // ...
        return res.status(403).json({ message: 'Invalid or expired token. Please log in again.' });
    }
};


// ==========================================================
//                     CASHFREE PAYMENT ROUTES (New)
// ==========================================================

// ... (start of server.js)

// 14. POST Create Cashfree Order
//  POST /api/create-cashfree-order

app.post('/api/create-cashfree-order', async (req, res) => {
    // Ensure all Cashfree credentials are available
    if (!CASHFREE_CLIENT_ID || !CASHFREE_CLIENT_SECRET) {
        return res.status(500).json({ success: false, message: 'Cashfree credentials not set.' });
    }
    
    try {
        const { amount, name, email, mobile, pan } = req.body; 
        
        // Input validation
        if (!amount || !name || !email || !mobile) {
            return res.status(400).json({ success: false, message: 'Required donor details are missing.' });
        }

        const orderId = `order_${uuidv4()}`; // Unique Order ID generate karna
        const amountInRupees = parseFloat(amount).toFixed(2);
        
        // 1. MySQL mein PENDING record save karna
        try {
            const sqlInsert = `
                INSERT INTO donations (order_id, name, email, mobile, pan, amount, status) 
                VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
            `;
            await dbPool.query(sqlInsert, [orderId, name, email, mobile, pan || null, amountInRupees]);
        } catch (dbError) {
            console.error("❌ DB Error saving PENDING donation:", dbError);
            // Agar DB save fail hota hai, to payment initiate nahi karenge
            return res.status(500).json({ success: false, message: 'Failed to record donation attempt in database.' });
        }


        // 2. Cashfree API ke liye data structure
        const RETURN_URL = `${DOMAIN_URL}/payment/success?order_id={order_id}&order_token={order_token}`; 
        const NOTIFY_URL = `${DOMAIN_URL}/api/cashfree-webhook`; // Webhook for server-to-server updates
        
        const orderPayload = {
            order_id: orderId,
            order_amount: amountInRupees,
            order_currency: "INR",
            customer_details: {
                // 💡 FIX: customer_id required by Cashfree. Using mobile number as ID.
                customer_id: mobile, 
                customer_phone: mobile,
                customer_email: email,
                customer_name: name,
            },
            order_meta: {
                return_url: RETURN_URL,
                notify_url: NOTIFY_URL, 
            },
        };
        
        const fetchURL = `${CASHFREE_BASE_URL}/orders`;

        // 3. Cashfree API Call karna using fetch
        const response = await fetch(fetchURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': CASHFREE_CLIENT_ID,
                'x-client-secret': CASHFREE_CLIENT_SECRET,
                'x-api-version': '2023-08-01', 
            },
            body: JSON.stringify(orderPayload),
        });
        
        const cashfreeResponse = await response.json();

        if (response.ok && cashfreeResponse.payment_link) {
            res.status(200).json({
                success: true,
                paymentLink: cashfreeResponse.payment_link, // Frontend will redirect to this
                orderId: orderId,
            });
        } else {
            // Agar Cashfree order creation fail ho jaye to DB record ko FAILED mark kar dein
            await dbPool.query("UPDATE donations SET status = 'FAILED' WHERE order_id = ?", [orderId]);
            console.error("Cashfree API Error:", cashfreeResponse);
            res.status(response.status || 500).json({ 
                success: false, 
                message: cashfreeResponse.message || 'Cashfree order creation failed' 
            });
        }

    } catch (error) {
        console.error("Error creating Cashfree order:", error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during order creation',
            error: error.message
        });
    }
});


// 15. GET Verify Cashfree Order Status (After Redirect)
app.get('/api/verify-cashfree-order/:orderId', async (req, res) => {
    if (!CASHFREE_CLIENT_ID || !CASHFREE_CLIENT_SECRET) {
        return res.status(500).json({ success: false, message: 'Cashfree credentials not set.' });
    }
    
    try {
        const orderId = req.params.orderId;
        const fetchURL = `${CASHFREE_BASE_URL}/orders/${orderId}`;

        const response = await fetch(fetchURL, {
            method: 'GET',
            headers: {
                'x-client-id': CASHFREE_CLIENT_ID,
                'x-client-secret': CASHFREE_CLIENT_SECRET,
                'x-api-version': '2023-08-01',
            }
        });

        const verificationResponse = await response.json();

        if (!response.ok) {
             console.error("Cashfree Verification API Error:", verificationResponse);
             return res.status(response.status || 500).json({ 
                success: false, 
                message: verificationResponse.message || 'Verification failed.' 
            });
        }
        
        const orderStatus = verificationResponse.order_status;
        
        if (orderStatus === 'PAID') {
            // ✅ CRITICAL: Yahaan MySQL mein transaction status update karein.
            // Aur, agar donation ka record pending mein nahi hai toh naya record insert karein.
            const { customer_details, order_amount, cf_order_id, payment_details } = verificationResponse;
            
            // Example MySQL Update/Insert logic
            const [updateResult] = await dbPool.query(
                `INSERT INTO donations (order_id, name, email, amount, transaction_id, cf_order_id, mode, status, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'COMPLETED', NOW())
                 ON DUPLICATE KEY UPDATE status = 'COMPLETED', transaction_id = ?, cf_order_id = ?`,
                [
                    orderId, 
                    customer_details.customer_name, 
                    customer_details.customer_email, 
                    order_amount, 
                    payment_details.payment_gateway_details?.txn_id || 'N/A', // transaction_id
                    cf_order_id,
                    payment_details.payment_method || 'Online',
                    payment_details.payment_gateway_details?.txn_id || 'N/A', // Update values
                    cf_order_id 
                ]
            );

            res.status(200).json({ success: true, status: orderStatus, message: 'Payment successful!', details: verificationResponse });
        } else {
            // TODO: Agar status FAILED/PENDING hai, toh DB record update karein.
            res.status(200).json({ success: false, status: orderStatus, message: 'Payment failed or pending.' });
        }

    } catch (error) {
        console.error("Verification Error:", error.message);
        res.status(500).json({ success: false, message: 'Verification failed.', error: error.message });
    }
});


// ... Rest of the old routes (Gallery, Contact, Projects, Donations) remains the same ...

// Server ko start karna (JWT_SECRET ab process.env se aayega)
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`ℹ️ Cashfree Base URL: ${CASHFREE_BASE_URL}`);
    console.log(`ℹ️ JWT Secret is set: ${JWT_SECRET.length > 20 ? 'Yes' : 'No'}`);
});