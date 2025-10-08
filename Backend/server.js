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
// Note: __dirname is the root of the Backend project
const UPLOAD_DIR = path.join(__dirname, 'public', 'images', 'gallery');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
// Images serve karne ke liye route: localhost:3000/images/...
app.use('/images', express.static(path.join(__dirname, 'public', 'images'))); 

// --- MULTER CONFIG (File upload) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, UPLOAD_DIR); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_')); }
});
const upload = multer({ storage: storage });


// --- API ROUTES ---

// FIX 1: Root route add kiya taaki "Cannot GET /" error na aaye (Refer to image_1c5e07.png)
app.get('/', (req, res) => {
    res.status(200).send('Devi Dham Trust Backend API is running.');
});


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
    // photoSrc mein /images/gallery/filename.jpg save hoga
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

// 3. DELETE Photo (Admin Dashboard se call hoga)
app.delete('/api/admin/gallery/:id', async (req, res) => {
    const photoId = req.params.id;

    try {
        // Step 1: Database se photo ka 'src' (file path) fetch karo
        const [rows] = await dbPool.query('SELECT src FROM gallery_photos WHERE id = ?', [photoId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Photo not found in database.' });
        }

        const photoSrc = rows[0].src;
        
        // Step 2: Database se entry delete karo
        const [dbResult] = await dbPool.query('DELETE FROM gallery_photos WHERE id = ?', [photoId]);
        
        if (dbResult.affectedRows === 0) {
             return res.status(404).json({ message: 'Database deletion failed, photo not found.' });
        }

        // Step 3: Server ke file system se actual image file delete karo
        
        // FIX 2: Path handling ko theek kiya (image_b55a59.png error fix)
        // photoSrc mein /images/gallery/... hai. Hum isse path.join mein direct use karenge.
        // __dirname + /public + /images/gallery/...
        const filePath = path.join(__dirname, 'public', photoSrc); 
        
        // File delete karo (Error ko ignore karo agar file pehle se deleted hai)
        fs.unlink(filePath, (err) => {
            if (err) {
                // Agar file delete nahi hui toh console mein warning denge, 
                // lekin success return karenge kyunki DB se data hat chuka hai.
                console.warn(`[WARN] File not found or failed to delete: ${filePath}. DB entry removed.`);
            } else {
                console.log(`[INFO] File successfully deleted: ${filePath}`);
            }
        });

        res.json({ message: 'Photo successfully deleted from DB and server.' });

    } catch (error) {
        console.error('CRITICAL ERROR deleting photo:', error);
        res.status(500).json({ message: 'Error deleting photo entry due to a server issue.' });
    }
});

// Backend/server.js (Contact Form POST API)

// 4. POST Contact Form Submission
app.post('/api/contact', async (req, res) => {
    // Frontend se yeh data aayega
    const { name, email, subject, message } = req.body;

    // Data validation (basic check)
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, Email, and Message are required fields.' });
    }

    try {
        // SQL query: Data ko contact_submissions table mein insert karo
        const sql = `
            INSERT INTO contact_submissions (name, email, subject, message) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await dbPool.query(sql, [name, email, subject || 'No Subject', message]);

        // Email sending logic (optional - abhi skip kar rahe hain)
        // Yahan par nodemailer se email bhejne ka code aayega.

        res.status(201).json({ 
            message: 'Your message has been received successfully!', 
            submissionId: result.insertId 
        });

    } catch (error) {
        console.error('Error saving contact submission:', error);
        res.status(500).json({ message: 'Error submitting form. Please try again later.' });
    }
});

// 5. GET All Contact Submissions (Admin Dashboard ke liye)
app.get('/api/admin/contacts', async (req, res) => {
    try {
        // Latest submission pehle dikhane ke liye ORDER BY DESC
        const sql = 'SELECT id, name, email, subject, message, submission_date FROM contact_submissions ORDER BY submission_date DESC';
        const [rows] = await dbPool.query(sql);

        res.json(rows); 
    } catch (error) {
        console.error('Error fetching contact submissions:', error);
        res.status(500).json({ message: 'Error fetching contact submissions.' });
    }
});

// Backend/server.js (Projects API Routes)

const PROJECT_UPLOAD_DIR = path.join(__dirname, 'public', 'images', 'projects');
if (!fs.existsSync(PROJECT_UPLOAD_DIR)) {
    fs.mkdirSync(PROJECT_UPLOAD_DIR, { recursive: true });
}

// Multer storage for Projects
const projectStorage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, PROJECT_UPLOAD_DIR); },
    filename: (req, file, cb) => { cb(null, 'project-' + Date.now() + '-' + file.originalname.replace(/\s/g, '_')); }
});
const projectUpload = multer({ storage: projectStorage });


// 6. POST Add New Project (Admin Uploader)
app.post('/api/admin/projects', projectUpload.single('projectImage'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No project image uploaded.' });
    }

    const { title, description, status } = req.body;
    const image_src = '/images/projects/' + req.file.filename;

    try {
        const sql = 'INSERT INTO projects (title, description, image_src, status) VALUES (?, ?, ?, ?)';
        const [result] = await dbPool.query(sql, [title, description, image_src, status || 'Active']);
        
        res.status(201).json({ 
            message: 'Project created successfully and saved to DB!', 
            projectId: result.insertId 
        });
    } catch (error) {
        console.error('Error saving project data to DB:', error);
        // Agar database mein save nahi hua, toh file ko delete kar do
        fs.unlink(req.file.path, () => {}); 
        res.status(500).json({ message: 'Error saving project data to database.' });
    }
});


// 7. GET All Projects (Frontend aur Admin List ke liye)
app.get('/api/projects', async (req, res) => {
    try {
        // Latest created project pehle dikhega
        const sql = 'SELECT id, title, description, image_src, status, created_at FROM projects ORDER BY created_at DESC';
        const [rows] = await dbPool.query(sql);
        
        res.json(rows);
    } catch (error) {
        console.error('Error fetching projects from DB:', error);
        res.status(500).json({ message: 'Error fetching projects.' });
    }
});
// Backend/server.js (DELETE API - Project Deletion)

// 8. DELETE Project (Admin Dashboard se call hoga)
app.delete('/api/admin/projects/:id', async (req, res) => {
    const projectId = req.params.id;

    try {
        // Step 1: Database se project ki 'image_src' (file path) fetch karo
        const [rows] = await dbPool.query('SELECT image_src FROM projects WHERE id = ?', [projectId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Project not found in database.' });
        }

        const projectImageSrc = rows[0].image_src;
        
        // Step 2: Database se entry delete karo
        const [dbResult] = await dbPool.query('DELETE FROM projects WHERE id = ?', [projectId]);
        
        if (dbResult.affectedRows === 0) {
             return res.status(404).json({ message: 'Database deletion failed, project not found.' });
        }

        // Step 3: Server ke file system se actual image file delete karo
        // projectImageSrc mein /images/projects/... hai. Hum isse path.join mein direct use karenge.
        const filePath = path.join(__dirname, 'public', projectImageSrc); 
        
        // File delete karo 
        fs.unlink(filePath, (err) => {
            if (err) {
                console.warn(`[WARN] Project file not found or failed to delete: ${filePath}. DB entry removed.`);
            } else {
                console.log(`[INFO] Project file successfully deleted: ${filePath}`);
            }
        });

        res.json({ message: 'Project successfully deleted from DB and server.' });

    } catch (error) {
        console.error('CRITICAL ERROR deleting project:', error);
        res.status(500).json({ message: 'Error deleting project entry due to a server issue.' });
    }
});

// Backend/server.js (PUT/PATCH API - Project Update)
// Note: Yeh API image file ko update nahi karta, sirf text fields ko update karta hai.

// 9. PUT/PATCH Update Project Details
app.put('/api/admin/projects/:id', async (req, res) => {
    const projectId = req.params.id;
    // Frontend se yeh fields aayengi
    const { title, description, status } = req.body; 

    // Basic validation
    if (!title || !description || !status) {
        return res.status(400).json({ message: 'Title, Description, and Status are required fields for update.' });
    }

    try {
        // SQL query: Specified fields ko update karo
        const sql = `
            UPDATE projects 
            SET title = ?, description = ?, status = ? 
            WHERE id = ?
        `;
        const [result] = await dbPool.query(sql, [title, description, status, projectId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Project not found or no changes made.' });
        }

        res.json({ message: 'Project updated successfully!', projectId });

    } catch (error) {
        console.error('CRITICAL ERROR updating project:', error);
        res.status(500).json({ message: 'Error updating project details due to a server issue.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});