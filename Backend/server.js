// Backend/server.js (Using MySQL/mysql2 for Permanent Storage)

// ==========================================================
// 🚨 CRITICAL: .ENV FILE LOAD KAREIN (Sabse Pehle)
// ==========================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_devidhaam';

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'devidhaam'
};

let dbPool = null;
(async () => {
    try {
        dbPool = await mysql.createPool(dbConfig);
        console.log('✅ MySQL Pool created.');
    } catch (err) {
        console.warn('⚠️ MySQL pool creation failed, running with degraded features:', err.message);
        dbPool = null;
    }
})();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

const uploadDir = path.join(__dirname, 'public', 'images', 'gallery');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({ destination: uploadDir, filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g,'_')) });
const upload = multer({ storage });

app.get('/api/gallery', async (req, res) => {
    try {
        if (!dbPool) return res.json([]);
        const [rows] = await dbPool.query('SELECT id, src, caption, category, upload_date AS date FROM gallery_photos ORDER BY upload_date DESC');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching gallery', err.message);
        res.status(500).json({ message: 'Error fetching gallery' });
    }
});

app.post('/api/donate', async (req, res) => {
    try {
        const { amount, name, email, mobile, pan } = req.body;
        if (!amount || !name || !email) return res.status(400).json({ message: 'Missing fields' });
        const donation = { id: Date.now().toString(), amount, name, email, mobile: mobile || null, pan: pan || null, status: 'pending' };
        if (dbPool) {
            try {
                await dbPool.query('INSERT INTO donations (order_id,name,email,amount,status,created_at) VALUES (?,?,?,?,?,NOW())', [donation.id, donation.name, donation.email, donation.amount, donation.status]);
            } catch (err) {
                console.warn('DB persist failed for donation:', err.message);
            }
        }
        res.json({ success: true, donation });
    } catch (err) {
        console.error('Donate error', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) return res.status(400).json({ message: 'Missing fields' });
        if (dbPool) {
            try {
                const [result] = await dbPool.query('INSERT INTO contact_submissions (name,email,subject,message,submission_date) VALUES (?,?,?,?,NOW())', [name, email, subject || '', message]);
                return res.status(201).json({ message: 'Received', submissionId: result.insertId });
            } catch (err) {
                console.warn('DB save failed for contact submission:', err.message);
            }
        }
        res.status(201).json({ message: 'Received', submissionId: Date.now() });
    } catch (err) {
        console.error('Contact error', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.use((req, res) => res.status(404).json({ message: 'API route not found' }));

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`ℹ️ JWT Secret configured: ${JWT_SECRET ? 'Yes' : 'No'}`);
});