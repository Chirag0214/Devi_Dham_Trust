// Backend/server.js (Using MySQL/mysql2 for Permanent Storage)

const express = require('express');
const cors = require('cors');
const multer = require('multer'); 
const mysql = require('mysql2/promise');
const path = require('path'); 
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // JWT package import kiya
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;
const saltRounds = 10; // For password hashing
const JWT_SECRET = 'your_secret_key_for_devidhaam'; // 🛑 IMPORTANT: Isse badal de!

// 🛑 IMPORTANT: Apni MySQL credentials yahan daalein
const dbConfig = {
    host: 'localhost',      
    user: 'root',           
    password: '',           
    database: 'devidhaam'   
};

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
app.use(cors()); // CORS enable karein
app.use(express.json()); // JSON body parse karein
app.use(express.urlencoded({ extended: true })); // Form data parse karein

// Simple request logger to help debug route issues
app.use((req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.originalUrl} - Authorization: ${authHeader ? 'present' : 'missing'}`);
    } catch (e) {
        // ignore logging errors
    }
    next();
});

// Static folder setup for uploaded images
const UPLOAD_BASE_DIR = path.join(__dirname, 'public', 'images');
const GALLERY_UPLOAD_DIR = path.join(UPLOAD_BASE_DIR, 'gallery');
const PROJECT_UPLOAD_DIR = path.join(UPLOAD_BASE_DIR, 'projects');

// Directories agar nahi hain toh bana lo
[GALLERY_UPLOAD_DIR, PROJECT_UPLOAD_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Images serve karne ke liye route: localhost:3000/images/...
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// --- MAILER TRANSPORTER (uses env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_SECURE) ---
const createMailerTransport = () => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = process.env.SMTP_SECURE === 'true';

    if (!host || !user || !pass) {
        console.warn('[WARN] SMTP credentials not fully configured. /api/admin/reply will fail until env vars are set.');
    }

    return nodemailer.createTransport({
        host: host || 'smtp.example.com',
        port: port,
        secure: secure, // true for 465, false for other ports
        auth: user && pass ? { user, pass } : undefined,
    });
};


// --- MULTER CONFIG (File upload) ---
const galleryStorage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, GALLERY_UPLOAD_DIR); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-gallery-' + file.originalname.replace(/\s/g, '_')); }
});
const uploadGallery = multer({ storage: galleryStorage });

const projectStorage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, PROJECT_UPLOAD_DIR); },
    filename: (req, file, cb) => { cb(null, 'project-' + Date.now() + '-' + file.originalname.replace(/\s/g, '_')); }
});
const uploadProject = multer({ storage: projectStorage });

// --- AUTHENTICATION MIDDLEWARE --- 
// Har protected route se pehle token check karega
const authenticateToken = (req, res, next) => {
    // 1. Header se token nikalna
    const authHeader = req.headers['authorization'];
    // Format: 'Bearer TOKEN_STRING'
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // Token missing (401 Unauthorized)
        return res.status(401).json({ message: 'Authentication token missing. Please log in.' });
    }

    // 2. Token Verify karna
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Token invalid ya expired (403 Forbidden)
            console.log('Token verification failed:', err.message);
            return res.status(403).json({ message: 'Invalid or expired token. Please log in again.' });
        }
        // Token valid, user details ko request object mein store karna
        req.user = user; 
        next(); // Agle route handler function par jaana
    });
};


// ==========================================================
//                     CORE AUTH ROUTES (Should be early)
// ==========================================================

app.get('/', (req, res) => {
    res.status(200).send('Devi Dham Trust Backend API is running.');
});

// 1. POST User Registration (Sign Up)
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required for registration.' });
    }

    try {
        // Check if user already exists
        const [existingUsers] = await dbPool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }
        
        // Password Hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds); 
        
        // Database mein data INSERT karna
        const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')`;
        const [result] = await dbPool.query(sql, [name, email, hashedPassword]);

        res.status(201).json({ 
            id: result.insertId,
            message: 'Registration successful. Please log in.' 
        });

    } catch (error) {
        console.error('❌ CRITICAL ERROR during user registration:', error);
        res.status(500).json({ message: 'Internal server error during registration.' });
    }
});

// 2. POST User Login (Authentication)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // 1. Database se user ko fetch karo
        const sql = 'SELECT id, name, email, password, role FROM users WHERE email = ?';
        const [rows] = await dbPool.query(sql, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = rows[0];

        // 2. Password compare karo
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // 3. Success: JWT Token Generate karo
        const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); // Token 7 din ke liye valid hoga

        // 4. User data aur Token return karo
        const authenticatedUser = {
            id: user.id, 
            name: user.name,
            email: user.email,
            role: user.role,
        };

        res.status(200).json({ 
            message: 'Login successful.',
            token: token, // 👈 Token bhejna zaroori hai
            user: authenticatedUser
        });

    } catch (error) {
        console.error('❌ CRITICAL ERROR during user login:', error);
        res.status(500).json({ message: 'Internal server error during login.' });
    }
});


// 3. GET All Users (Admin User List) - 💡 PROTECTED
app.get('/api/users', authenticateToken, async (req, res) => {
    // Optional: Only Admin users should access this
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    try {
        const sql = 'SELECT id, name, email, role FROM users ORDER BY id ASC'; 
        const [rows] = await dbPool.query(sql);
        res.json(rows); 
    } catch (error) {
        console.error('❌ Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users list.' });
    }
});

// 4. DELETE User (Admin only) - 💡 PROTECTED
app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }
    
    const userId = req.params.id;
    try {
        const [dbResult] = await dbPool.query('DELETE FROM users WHERE id = ?', [userId]);
        
        if (dbResult.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or deletion failed.' });
        }

        res.json({ message: 'User successfully removed from database.' });

    } catch (error) {
        console.error('❌ CRITICAL ERROR deleting user:', error);
        res.status(500).json({ message: 'Error deleting user due to a server issue.' });
    }
});

// GET single user by id (Admin only)
app.get('/api/admin/users/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    const userId = req.params.id;
    try {
        console.log(`[DEBUG] GET /api/admin/users/${userId} requested by user:`, req.user);
        // Only select known columns that exist in the users table to avoid SQL errors
        const sql = 'SELECT id, name, email, role FROM users WHERE id = ?';
        const [rows] = await dbPool.query(sql, [userId]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });
        res.json(rows[0]);
    } catch (error) {
        console.error('❌ Error fetching user:', error && error.stack ? error.stack : error);
        res.status(500).json({ message: 'Error fetching user.' });
    }
});

// Update user by id (Admin only)
app.put('/api/admin/users/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    const userId = req.params.id;
    const { name, email, role, password } = req.body;

    try {
        // If password provided, hash it
        let updateFields = [];
        let params = [];
        if (name !== undefined) { updateFields.push('name = ?'); params.push(name); }
        if (email !== undefined) { updateFields.push('email = ?'); params.push(email); }
        if (role !== undefined) { updateFields.push('role = ?'); params.push(role); }
        if (password) {
            const hashed = await bcrypt.hash(password, saltRounds);
            updateFields.push('password = ?'); params.push(hashed);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields provided for update.' });
        }

    params.push(userId);
    // Update only the requested fields. Do not assume updated_at column exists.
    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    const [result] = await dbPool.query(sql, params);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found or no changes made.' });

        res.json({ message: 'User updated successfully.' });
    } catch (error) {
        console.error('❌ Error updating user:', error);
        res.status(500).json({ message: 'Error updating user.' });
    }
});

// ==========================================================
//                     OTHER API ROUTES (Gallery, Contact, Projects)
// ==========================================================

// 5. GET Photos (Frontend ke liye) - NOT PROTECTED
app.get('/api/gallery', async (req, res) => {
    try {
        const sql = 'SELECT id, src, caption, category, upload_date AS date FROM gallery_photos ORDER BY upload_date DESC';
        const [rows] = await dbPool.query(sql);
        res.json(rows);
    } catch (error) {
        console.error('❌ Error fetching photos from DB:', error);
        res.status(500).json({ message: 'Error fetching gallery photos.' });
    }
});

// 6. POST Add New Photo (Admin Uploader) - 💡 PROTECTED
app.post('/api/admin/gallery', authenticateToken, uploadGallery.single('photo'), async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { caption, category } = req.body;
    // Fix path: 'public' folder ko nikal do, kyunki 'images' se serve ho raha hai
    const photoSrc = '/images/gallery/' + req.file.filename; 

    try {
        const sql = 'INSERT INTO gallery_photos (src, caption, category) VALUES (?, ?, ?)';
        const [result] = await dbPool.query(sql, [photoSrc, caption || 'No Caption', category || 'General']);
        
        const newPhoto = {
            id: result.insertId, 
            src: photoSrc,
            caption: caption || 'No Caption',
            category: category || 'General',
            date: new Date()
        };

        res.status(201).json({ message: 'Photo uploaded successfully and saved to DB!', photo: newPhoto });
    } catch (error) {
        console.error('❌ Error saving photo data to DB:', error);
        fs.unlink(req.file.path, () => {}); 
        res.status(500).json({ message: 'Error saving photo data to database.' });
    }
});

// 7. DELETE Photo (Admin Dashboard) - 💡 PROTECTED
app.delete('/api/admin/gallery/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    const photoId = req.params.id;
    
    try {
        const [rows] = await dbPool.query('SELECT src FROM gallery_photos WHERE id = ?', [photoId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Photo not found in database.' });
        }

        const photoSrc = rows[0].src;
        
        const [dbResult] = await dbPool.query('DELETE FROM gallery_photos WHERE id = ?', [photoId]);
        
        if (dbResult.affectedRows === 0) {
             return res.status(404).json({ message: 'Database deletion failed, photo not found.' });
        }

        // Correct file path for deletion
        const filePath = path.join(__dirname, 'public', photoSrc); 
        fs.unlink(filePath, (err) => {
            if (err) { console.warn(`[WARN] File failed to delete: ${filePath}. DB entry removed.`); } 
            else { console.log(`[INFO] File successfully deleted: ${filePath}`); }
        });

        res.json({ message: 'Photo successfully deleted from DB and server.' });

    } catch (error) {
        console.error('❌ CRITICAL ERROR deleting photo:', error);
        res.status(500).json({ message: 'Error deleting photo entry due to a server issue.' });
    }
});

// 8. POST Contact Form Submission - NOT PROTECTED
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, Email, and Message are required fields.' });
    }

    try {
        // 'created_at' column DB table से match करना चाहिए
        const sql = `INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)`;
        const [result] = await dbPool.query(sql, [name, email, subject || 'No Subject', message]);

        res.status(201).json({ 
            message: 'Your message has been received successfully!', 
            submissionId: result.insertId 
        });

    } catch (error) {
        console.error('❌ Error saving contact submission:', error);
        res.status(500).json({ message: 'Error submitting form. Please try again later.' });
    }
});


// 9. GET All Contact Submissions (Admin Dashboard) - 💡 PROTECTED
app.get('/api/admin/submissions', authenticateToken, async (req, res) => {
    // Optional: Admin role check
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    try {
        // ✅ FINAL FIX: हमने 'submission_date' (जो DB में है) का उपयोग किया है और इसे 
        // 'AS created_at' (जिसे frontend उम्मीद कर रहा है) का alias दिया है।
        const sql = 'SELECT id, name, email, subject, message, submission_date AS created_at FROM contact_submissions ORDER BY submission_date DESC';
        const [rows] = await dbPool.query(sql);
        
        // Frontend ko { submissions: [...] } format mein bhej rahe hain
        res.json({ submissions: rows }); 
    } catch (error) {
        console.error('❌ Error fetching contact submissions:', error);
        // Error hone par bhi JSON response bhejna zaroori hai
        res.status(500).json({ message: 'Error fetching contact submissions.' });
    }
})

// 9c. DELETE a contact submission (Admin only) - 💡 PROTECTED
app.delete('/api/admin/submissions/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    const id = req.params.id;
    console.log(`[DEBUG] Request to delete submission id=${id} by user=${req.user?.email || req.user?.id}`);
    try {
        const [result] = await dbPool.query('DELETE FROM contact_submissions WHERE id = ?', [id]);
        console.log('[DEBUG] delete result:', result);
        if (result.affectedRows === 0) {
            console.log(`[DEBUG] No rows affected when deleting id=${id}`);
            return res.status(404).json({ message: 'Submission not found.' });
        }
        console.log(`[DEBUG] Submission id=${id} deleted successfully (affectedRows=${result.affectedRows})`);
        res.json({ message: 'Submission removed successfully.' });
    } catch (error) {
        console.error('❌ Error deleting contact submission:', error);
        res.status(500).json({ message: 'Error deleting contact submission.' });
    }
});

// 9b. POST Reply to a contact submission (Admin only) - 💡 PROTECTED
// Body: { to: string, subject: string, body: string }
app.post('/api/admin/reply', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    const { to, subject, body } = req.body;
    if (!to || !subject || !body) {
        return res.status(400).json({ message: 'Missing required fields: to, subject, body.' });
    }

    try {
        const transporter = createMailerTransport();
        const fromAddress = process.env.SMTP_FROM || 'no-reply@devidhaam.org';

        const info = await transporter.sendMail({
            from: fromAddress,
            to,
            subject,
            text: body,
        });

        console.log(`[INFO] Reply email sent to ${to}. MessageId: ${info.messageId}`);
        res.json({ message: 'Reply sent successfully.' });
    } catch (error) {
        console.error('❌ Error sending reply email:', error);
        res.status(500).json({ message: 'Error sending reply email.' });
    }
});
// 10. POST Add New Project (Admin Uploader) - 💡 PROTECTED
app.post('/api/admin/projects', authenticateToken, uploadProject.single('projectImage'), async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

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
        console.error('❌ Error saving project data to DB:', error);
        fs.unlink(req.file.path, () => {}); 
        res.status(500).json({ message: 'Error saving project data to database.' });
    }
});

// 11. GET All Projects (Frontend aur Admin List) - NOT PROTECTED
app.get('/api/projects', async (req, res) => {
    try {
        const sql = 'SELECT id, title, description, image_src, status, created_at FROM projects ORDER BY created_at DESC';
        const [rows] = await dbPool.query(sql);
        res.json(rows);
    } catch (error) {
        console.error('❌ Error fetching projects from DB:', error);
        res.status(500).json({ message: 'Error fetching projects.' });
    }
});

// 12. DELETE Project (Admin Dashboard) - 💡 PROTECTED
app.delete('/api/admin/projects/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    const projectId = req.params.id;
    
    try {
        const [rows] = await dbPool.query('SELECT image_src FROM projects WHERE id = ?', [projectId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Project not found in database.' });
        }

        const projectImageSrc = rows[0].image_src;
        
        const [dbResult] = await dbPool.query('DELETE FROM projects WHERE id = ?', [projectId]);
        
        if (dbResult.affectedRows === 0) {
             return res.status(404).json({ message: 'Database deletion failed, project not found.' });
        }

        const filePath = path.join(__dirname, 'public', projectImageSrc); 
        fs.unlink(filePath, (err) => {
            if (err) { console.warn(`[WARN] Project file failed to delete: ${filePath}. DB entry removed.`); } 
            else { console.log(`[INFO] Project file successfully deleted: ${filePath}`); }
        });

        res.json({ message: 'Project successfully deleted from DB and server.' });

    } catch (error) {
        console.error('❌ CRITICAL ERROR deleting project:', error);
        res.status(500).json({ message: 'Error deleting project entry due to a server issue.' });
    }
});

// 13. PUT/PATCH Update Project Details - 💡 PROTECTED
app.put('/api/admin/projects/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    const projectId = req.params.id;
    const { title, description, status } = req.body; 

    if (!title || !description || !status) {
        return res.status(400).json({ message: 'Title, Description, and Status are required fields for update.' });
    }

    try {
        const sql = `UPDATE projects SET title = ?, description = ?, status = ? WHERE id = ?`;
        const [result] = await dbPool.query(sql, [title, description, status, projectId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Project not found or no changes made.' });
        }

        res.json({ message: 'Project updated successfully!', projectId });

    } catch (error) {
        console.error('❌ CRITICAL ERROR updating project:', error);
        res.status(500).json({ message: 'Error updating project details due to a server issue.' });
    }
});

// 🚨 CRITICAL: Missing Route Handler (404 Fallback)
// Saare routes check hone ke baad, agar koi match nahi hota toh yeh chalta hai
app.use((req, res) => {
    res.status(404).json({ message: 'API Route Not Found.' });
});

// ==========================================================
//                     SERVER START
// ==========================================================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('=============================================');
});
