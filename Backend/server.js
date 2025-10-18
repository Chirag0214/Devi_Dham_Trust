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
let dbPool = null;
try {
    dbPool = mysql.createPool(dbConfig);
    console.log('✅ MySQL Pool created successfully.');
} catch (error) {
    // Don't exit the process: allow server to start for static and test endpoints
    console.warn('⚠️ Failed to create MySQL Pool. DB unavailable for now. Continuing without DB. Error:', error && error.message ? error.message : error);
    dbPool = null; // routes must check for dbPool before using it
}

// In-memory cache for projects so admin edit/delete works during development
let projectsCache = null;

// --- In-memory users fallback (development) ---
// If the MySQL DB is not available, this array stores users for login/register so frontend still works.
const inMemoryUsers = [];
const findInMemoryUserByEmail = (email) => inMemoryUsers.find(u => u.email === String(email).toLowerCase());
const addInMemoryUser = async (name, email, password, role = 'user') => {
    const id = inMemoryUsers.length ? (inMemoryUsers[inMemoryUsers.length - 1].id + 1) : 1;
    const password_hash = await bcrypt.hash(String(password), saltRounds);
    const user = { id, name: name || email, email: String(email).toLowerCase(), password_hash, role };
    inMemoryUsers.push(user);
    return user;
};

// Seed a development admin account if none provided
(async () => {
    try {
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@devidhaam.org').toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD || '123';
        if (!findInMemoryUserByEmail(adminEmail)) {
            await addInMemoryUser('Admin', adminEmail, adminPassword, 'admin');
            console.log(`ℹ️ Seeded fallback admin account: ${adminEmail} (use env ADMIN_PASSWORD to change)`);
        }
    } catch (e) {
        // ignore seeding errors
    }
})();

// ==========================================================
//                 SETUP & MIDDLEWARE (CRITICAL: Order Matters!)
// ==========================================================
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Simple request logger to help debug routing issues
app.use((req, res, next) => {
    try {
        console.log(`[REQ] ${req.method} ${req.path}`);
    } catch (e) { /* ignore logging errors */ }
    next();
});

// Serve static files (images) from Backend/public
const staticDir = path.join(__dirname, 'public');
if (fs.existsSync(staticDir)) {
    app.use('/public', express.static(staticDir));
}

// --- Simple API endpoints for frontend gallery/projects ---
// These will read images from Backend/public/images/gallery and /projects
// and return a JSON array that the frontend expects. If folders are
// missing, return a small fallback sample so frontend doesn't show empty pages.
app.get('/api/gallery', async (req, res) => {
    try {
        const galleryDir = path.join(__dirname, 'public', 'images', 'gallery');
        let items = [];

        if (fs.existsSync(galleryDir)) {
            const files = fs.readdirSync(galleryDir).filter(f => /\.(jpe?g|png|avif|webp)$/i.test(f));
            items = files.map((file, idx) => ({
                id: idx + 1,
                src: `/public/images/gallery/${file}`,
                caption: `Gallery photo ${idx + 1}`,
                category: 'Event',
                date: new Date().toISOString(),
            }));
        }

        // Fallback: if no files found, return a few images from frontend public folder
        if (items.length === 0) {
            items = [
                { id: 1, src: '/images/plantation.avif', caption: 'Plantation', category: 'Environment', date: new Date().toISOString() },
                { id: 2, src: '/images/plantation1.avif', caption: 'Volunteers', category: 'Community', date: new Date().toISOString() },
            ];
        }

        return res.json(items);
    } catch (err) {
        console.error('Error serving /api/gallery:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/projects', async (req, res) => {
    try {
        const projectsDir = path.join(__dirname, 'public', 'images', 'projects');
        let items = [];

        if (fs.existsSync(projectsDir)) {
            const files = fs.readdirSync(projectsDir).filter(f => /\.(jpe?g|png|avif|webp)$/i.test(f));
            items = files.map((file, idx) => ({
                id: idx + 1,
                title: `Project ${idx + 1}`,
                description: `Description for project ${idx + 1}`,
                image_src: `/public/images/projects/${file}`,
            }));
        }

        if (items.length === 0) {
            // Fallback sample projects
            items = [
                { id: 1, title: 'Plantation Drive', description: 'Tree plantation in local community', image_src: '/images/plantation.avif', status: 'Active' },
                { id: 2, title: 'Health Camp', description: 'Free health screening', image_src: '/images/plantation1.avif', status: 'Completed' },
            ];
        }

        // Add full_image_src to match frontend expectation
        const backendOrigin = `${req.protocol}://${req.get('host')}`;
        const result = items.map((it, i) => ({
            ...it,
            full_image_src: it.image_src && it.image_src.startsWith('http') ? it.image_src : `${backendOrigin}${it.image_src}`,
        }));

        // Initialize projectsCache for admin operations if not set
        if (!projectsCache) projectsCache = result.map(r => ({ ...r }));

        return res.json(result);
    } catch (err) {
        console.error('Error serving /api/projects:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Update project (PUT)
app.put('/api/admin/projects/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { title, description, status } = req.body;

    try {
        // If DB available, update DB; otherwise update in-memory cache
        if (dbPool) {
            const sql = `UPDATE projects SET title = ?, description = ?, status = ? WHERE id = ?`;
            await dbPool.query(sql, [title, description, status, id]);
            return res.json({ success: true });
        }

        if (!projectsCache) return res.status(404).json({ message: 'Project not found' });
        const idx = projectsCache.findIndex(p => p.id == id);
        if (idx === -1) return res.status(404).json({ message: 'Project not found' });

        projectsCache[idx].title = title;
        projectsCache[idx].description = description;
        projectsCache[idx].status = status;

        return res.json({ success: true, project: projectsCache[idx] });
    } catch (err) {
        console.error('Error updating project:', err);
        return res.status(500).json({ message: 'Failed to update project' });
    }
});

// Admin: Delete project (DELETE)
app.delete('/api/admin/projects/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
        if (dbPool) {
            const sql = `DELETE FROM projects WHERE id = ?`;
            await dbPool.query(sql, [id]);
            return res.json({ success: true });
        }

        if (!projectsCache) return res.status(404).json({ message: 'Project not found' });
        const idx = projectsCache.findIndex(p => p.id == id);
        if (idx === -1) return res.status(404).json({ message: 'Project not found' });

        projectsCache.splice(idx, 1);
        return res.json({ success: true });
    } catch (err) {
        console.error('Error deleting project:', err);
        return res.status(500).json({ message: 'Failed to delete project' });
    }
});

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

    // --- AUTH ROUTES: Register and Login (DB if available, else in-memory fallback) ---
    app.post('/api/register', async (req, res) => {
        const { name, email, password } = req.body || {};
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
        const normalizedEmail = String(email).toLowerCase();

        try {
            if (dbPool) {
                // Check if user exists
                const [rows] = await dbPool.query('SELECT id, name, email, password_hash, role FROM users WHERE email = ?', [normalizedEmail]);
                if (rows && rows.length) return res.status(409).json({ message: 'User already exists.' });

                const password_hash = await bcrypt.hash(String(password), saltRounds);
                const [result] = await dbPool.query('INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())', [name || normalizedEmail, normalizedEmail, password_hash, 'user']);
                const user = { id: result.insertId, name: name || normalizedEmail, email: normalizedEmail, role: 'user' };
                const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
                return res.status(201).json({ user, token });
            }

            // In-memory fallback
            if (findInMemoryUserByEmail(normalizedEmail)) return res.status(409).json({ message: 'User already exists.' });
            const user = await addInMemoryUser(name || normalizedEmail, normalizedEmail, password, 'user');
            const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
            return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
        } catch (err) {
            console.error('Registration error:', err && err.message ? err.message : err);
            return res.status(500).json({ message: 'Server error during registration.' });
        }
    });

    app.post('/api/login', async (req, res) => {
        const { email, password } = req.body || {};
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
        const normalizedEmail = String(email).toLowerCase();

        try {
            if (dbPool) {
                try {
                    const [rows] = await dbPool.query('SELECT id, name, email, password_hash, role FROM users WHERE email = ?', [normalizedEmail]);
                    if (rows && rows.length) {
                        const userRow = rows[0];
                        const ok = await bcrypt.compare(String(password), userRow.password_hash);
                        if (ok) {
                            const user = { id: userRow.id, name: userRow.name, email: userRow.email, role: userRow.role };
                            const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
                            return res.json({ user, token });
                        }
                        return res.status(401).json({ message: 'Invalid credentials.' });
                    }
                    // if no user found in DB, continue to fallback below
                } catch (dbErr) {
                    console.warn('DB lookup failed for /api/login, falling back to in-memory users. Error:', dbErr && dbErr.message ? dbErr.message : dbErr);
                    // fall through to in-memory fallback
                }
            }

            // In-memory fallback (or DB didn't find user)
            const user = findInMemoryUserByEmail(normalizedEmail);
            if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
            const ok = await bcrypt.compare(String(password), user.password_hash);
            if (!ok) return res.status(401).json({ message: 'Invalid credentials.' });
            const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
            return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
        } catch (err) {
            console.error('Login error:', err && err.message ? err.message : err);
            return res.status(500).json({ message: 'Server error during login.' });
        }
    });


// ==========================================================
//                     CASHFREE PAYMENT ROUTES (New)
// ==========================================================
// ==========================================================
// 14. POST Create Cashfree Order (FIXED for payment_session_id)
// ==========================================================

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
            const sqlInsert = `INSERT INTO donations (order_id, name, email, mobile, pan, amount, status) VALUES (?, ?, ?, ?, ?, ?, 'PENDING')`;
            await dbPool.query(sqlInsert, [orderId, name, email, mobile, pan || null, amountInRupees]);
        } catch (dbError) {
            console.error("❌ DB Error saving PENDING donation:", dbError);
            // Agar DB save fail hota hai, to payment initiate nahi karenge
            return res.status(500).json({ success: false, message: 'Failed to record donation attempt in database.' });
        }


        // 2. Cashfree API ke liye data structure
        // FIX: return_url no longer supports order_token
        const RETURN_URL = `${DOMAIN_URL}/payment/success?order_id={order_id}`;
        const NOTIFY_URL = `${DOMAIN_URL}/api/cashfree-webhook`; // Webhook for server-to-server updates
        
        const orderPayload = {
            order_id: orderId,
            order_amount: amountInRupees,
            order_currency: "INR",
            customer_details: {
                customer_id: mobile, 
                customer_phone: mobile,
                customer_email: email,
                customer_name: name,
            },
            order_meta: {
                return_url: RETURN_URL,
                notify_url: NOTIFY_URL, 
            },
            // Note: Cashfree API version '2023-08-01' use ho raha hai
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

        // 🛑 FIX YAHAN THA: payment_link ki jagah payment_session_id check kiya 🛑
        if (response.ok && cashfreeResponse.payment_session_id) {
            
            res.status(200).json({
                success: true,
                // Frontend ko session ID भेजो, जisse वह SDK initialize करेगा
                paymentSessionId: cashfreeResponse.payment_session_id, 
                orderId: orderId,
            });
        } else {
            // Agar order creation fail ho jaye (e.g., galat keys) toh DB ko FAILED mark karein
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

// ==========================================================
// 15. GET Verify Cashfree Order Status (After Redirect)
// ==========================================================
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
            // ON DUPLICATE KEY UPDATE logic (safeguard for idempotency)
            const { customer_details, order_amount, cf_order_id, payment_details } = verificationResponse;
            
            // Note: Assumed 'order_id' is UNIQUE/PRIMARY KEY in 'donations' table.
            const [updateResult] = await dbPool.query(
                `INSERT INTO donations (order_id, name, email, amount, transaction_id, cf_order_id, mode, status, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'COMPLETED', NOW())
                 ON DUPLICATE KEY UPDATE status = 'COMPLETED', transaction_id = VALUES(transaction_id), cf_order_id = VALUES(cf_order_id)`,
                [
                    orderId, 
                    customer_details.customer_name || customer_details.customer_id, // Safety check
                    customer_details.customer_email, 
                    order_amount, 
                    payment_details?.payment_gateway_details?.txn_id || 'N/A', 
                    cf_order_id,
                    payment_details?.payment_method || 'Online'
                ]
            );

            res.status(200).json({ success: true, status: orderStatus, message: 'Payment successful!', details: verificationResponse });
        } else {
            // TODO: Agar status FAILED/PENDING है, तो DB record update करें (अगर ज़रूरी हो)।
            res.status(200).json({ success: false, status: orderStatus, message: 'Payment failed or pending.' });
        }

    } catch (error) {
        console.error("Verification Error:", error.message);
        res.status(500).json({ success: false, message: 'Verification failed.', error: error.message });
    }
});



// Server ko start karna (JWT_SECRET ab process.env se aayega)
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`ℹ️ Cashfree Base URL: ${CASHFREE_BASE_URL}`);
    console.log(`ℹ️ JWT Secret is set: ${JWT_SECRET.length > 20 ? 'Yes' : 'No'}`);
});