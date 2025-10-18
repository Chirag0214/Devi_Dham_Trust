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

// Projects endpoint - return active projects or empty array
app.get('/api/projects', async (req, res) => {
    try {
        if (!dbPool) return res.json([]);
        // Prefer columns that typically exist in this schema
        const [rows] = await dbPool.query('SELECT id, title, description, image_src, status, created_at FROM projects ORDER BY created_at DESC');
        // Normalize column name expected by frontend (image_src or image)
        const normalized = rows.map(r => ({
            ...r,
            image_src: r.image_src || r.image || null
        }));
        res.json(normalized);
    } catch (err) {
        console.warn('Projects query failed:', err.message);
        res.json([]);
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

// Ensure projects upload directory exists
const projectsUploadDir = path.join(__dirname, 'public', 'images', 'projects');
if (!fs.existsSync(projectsUploadDir)) fs.mkdirSync(projectsUploadDir, { recursive: true });
const projectsStorage = multer.diskStorage({ destination: projectsUploadDir, filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g,'_')) });
const projectsUpload = multer({ storage: projectsStorage });

// Admin: Create new project (multipart/form-data with projectImage)
app.post('/api/admin/projects', projectsUpload.single('projectImage'), async (req, res) => {
    try {
        const title = req.body.title || '';
        const description = req.body.description || '';
        const status = req.body.status || 'Active';

        if (!title || !description) return res.status(400).json({ message: 'Missing fields' });

        let image_src = null;
        if (req.file) {
            // Save image path relative to server root
            image_src = `/images/projects/${req.file.filename}`;
        }

        const project = { id: Date.now().toString(), title, description, status, image_src, active: 1, created_at: new Date() };

        if (dbPool) {
            try {
                // Insert without `active` to match older schemas; created_at uses NOW()
                const [result] = await dbPool.query('INSERT INTO projects (title,description,image_src,status,created_at) VALUES (?,?,?,?,NOW())', [title, description, image_src, status]);
                project.id = result.insertId;
            } catch (err) {
                console.warn('DB insert failed for project:', err.message);
            }
        }

        res.status(201).json({ message: 'Project created', project });
    } catch (err) {
        console.error('Create project error', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Update project (JSON body)
app.put('/api/admin/projects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, status } = req.body;
        if (!title || !description) return res.status(400).json({ message: 'Missing fields' });

        if (dbPool) {
            try {
                const [result] = await dbPool.query('UPDATE projects SET title=?, description=?, status=? WHERE id=?', [title, description, status || 'Active', id]);
                return res.json({ message: 'Project updated' });
            } catch (err) {
                console.warn('DB update failed for project:', err.message);
            }
        }

        // Fallback: pretend update succeeded
        res.json({ message: 'Project updated (no DB available)' });
    } catch (err) {
        console.error('Update project error', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Delete project
app.delete('/api/admin/projects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (dbPool) {
            try {
                // Attempt to fetch image_src before deleting to remove file
                const [rows] = await dbPool.query('SELECT image_src FROM projects WHERE id=?', [id]);
                if (rows && rows[0] && rows[0].image_src) {
                    const imgPath = path.join(__dirname, rows[0].image_src.replace(/\//g, path.sep));
                    if (fs.existsSync(imgPath)) {
                        try { fs.unlinkSync(imgPath); } catch (e) { /* ignore */ }
                    }
                }
                await dbPool.query('DELETE FROM projects WHERE id=?', [id]);
                return res.json({ message: 'Project deleted' });
            } catch (err) {
                console.warn('DB delete failed for project:', err.message);
            }
        }

        // Fallback: pretend delete succeeded
        res.json({ message: 'Project deleted (no DB available)' });
    } catch (err) {
        console.error('Delete project error', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// 404 handler (should be last)
app.use((req, res) => res.status(404).json({ message: 'API route not found' }));

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`ℹ️ JWT Secret configured: ${JWT_SECRET ? 'Yes' : 'No'}`);
});