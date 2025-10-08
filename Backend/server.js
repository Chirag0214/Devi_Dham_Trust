// Backend/server.js (Using MySQL/mysql2 for Permanent Storage)

const express = require('express');
const cors = require('cors');
const multer = require('multer'); 
const mysql = require('mysql2/promise'); // MySQL connector
const path = require('path'); 
const fs = require('fs');

const app = express();
const PORT = 3000;

// 🛑 IMPORTANT: Apni MySQL credentials yahan daalein
const dbConfig = {
    host: 'localhost',      
    user: 'root',           // XAMPP ka default user
    password: '',           // XAMPP ka default password 'empty' hota hai, agar aapne set nahi kiya
    database: 'devidhaam'   
};

// --- DATABASE CONNECTION POOL ---
let dbPool;
try {
    // Database Pool banate hain taaki connections efficient ho
    dbPool = mysql.createPool(dbConfig);
    console.log('✅ MySQL Pool created successfully.');
} catch (error) {
    console.error('❌ Failed to create MySQL Pool:', error);
    // Agar yahan error aaye toh XAMPP mein MySQL ka password aur database name check karein
}

// --- SETUP & MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Static folder setup for uploaded images
const UPLOAD_DIR = path.join(__dirname, 'public', 'images', 'gallery');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
app.use('/images', express.static(path.join(__dirname, 'public', 'images'))); 

// --- MULTER CONFIG (File upload) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, UPLOAD_DIR); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_')); }
});
const upload = multer({ storage: storage });


// --- API ROUTES ---

// 1. GET Photos (Frontend ke liye)
app.get('/api/gallery', async (req, res) => {
    try {
        // SQL query: Latest photo date ke hisaab se order karo
        const sql = 'SELECT id, src, caption, category, upload_date AS date FROM gallery_photos ORDER BY upload_date DESC';
        const [rows] = await dbPool.query(sql);
        
        res.json(rows); // Rows mein permanent data hai
    } catch (error) {
        console.error('Error fetching photos from DB:', error);
        res.status(500).json({ message: 'Error fetching gallery photos.' });
    }
});

// 2. POST Add New Photo (Admin Uploader se call hoga)
app.post('/api/admin/gallery', upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { caption, category } = req.body;
    const photoSrc = '/images/gallery/' + req.file.filename;

    try {
        // SQL query: New data database mein insert karo
        const sql = 'INSERT INTO gallery_photos (src, caption, category) VALUES (?, ?, ?)';
        const [result] = await dbPool.query(sql, [photoSrc, caption || 'No Caption', category || 'General']);
        
        const newPhoto = {
            id: result.insertId, // Inserted row ki ID
            src: photoSrc,
            caption: caption || 'No Caption',
            category: category || 'General',
            date: new Date()
        };

        res.status(201).json({ message: 'Photo uploaded successfully and saved to DB!', photo: newPhoto });
    } catch (error) {
        console.error('Error saving photo data to DB:', error);
        // Agar database mein save nahi hua, toh file ko delete kar do
        fs.unlink(req.file.path, () => {}); 
        res.status(500).json({ message: 'Error saving photo data to database.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});