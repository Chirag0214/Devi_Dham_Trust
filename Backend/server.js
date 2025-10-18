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

// Cashfree integration removed in rollback branch. Payment processing uses internal endpoints.
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
    // Payment routes: Cashfree removed. Keep a simple donation endpoint used by frontend as a fallback.
    app.post('/api/donate', async (req, res) => {
        try {
            const { amount, name, email } = req.body;
            if (!amount || !name || !email) return res.status(400).json({ message: 'Missing fields' });

            // Minimal local donation handling: store in-memory for now (or forward to existing donations API)
            // This keeps frontend behaviour consistent until a payment gateway is added.
            const donation = { id: Date.now().toString(), amount, name, email, status: 'pending' };
            // TODO: persist to DB or call existing donations handler. For rollback, return success object.
            res.json({ success: true, donation });
        } catch (err) {
            console.error('Error creating donation', err);
            res.status(500).json({ message: 'Server error' });
        }
    });
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