const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME || 'dikonxiyq', 
    api_key: '437446832751749',
    api_secret: 'OeqDDPZtwibq33-rIFc0mKrbvgI'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'studycubs_blogs',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    },
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection Setup
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME, // LOCK the database here
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create database if not exists and then use it
pool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
    if (err) {
        console.error('Error creating database:', err);
        return;
    }
    console.log(`Database "${process.env.DB_NAME}" checked/created.`);
    
    // Now switch to using the database
    pool.query(`USE ${process.env.DB_NAME}`, (err) => {
        if (err) console.error('Error switching to database:', err);
        else {
            console.log(`Using database: ${process.env.DB_NAME}`);
            // Ensure updated_by column exists
            pool.query("ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS updated_by INT", (err) => {
                if (err) console.log("Note: updated_by column might already exist or MariaDB version is older.");
            });
        }
    });
});

const db = pool;

// --- AUTH ROUTES ---
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`\n--- Login Attempt ---`);
    console.log(`Username: ${username}`);
    
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: err.message });
        }
        
        if (results.length === 0) {
            console.log('User NOT found in database.');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        console.log('User found in database. Checking password...');
        
        try {
            // Debug: Log the stored hash
            console.log('Stored Hash:', user.password);
            
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Bcrypt Match Result:', isMatch);

            // FALLBACK: If bcrypt fails but password is 'admin123' and username is 'admin'
            // This is ONLY for troubleshooting right now.
            let finalMatch = isMatch;
            if (!isMatch && username === 'admin' && password === 'admin123') {
                console.log('WARNING: Bcrypt failed but fallback matched admin123. Letting user in...');
                finalMatch = true;
            }
            
            if (!finalMatch) {
                console.log('Login FAILED: Incorrect password.');
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            console.log('Login SUCCESSFUL!');
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({ token, user: { id: user.id, username: user.username, role: user.role, full_name: user.full_name } });
        } catch (bcryptErr) {
            console.error('Bcrypt Error:', bcryptErr);
            res.status(500).json({ error: 'Auth system error' });
        }
    });
});

// --- USER MANAGEMENT ---
app.post('/api/users', async (req, res) => {
    const { username, password, full_name, role } = req.body;
    console.log(`Creating user: ${username} with role: ${role}`);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)', 
        [username, hashedPassword, full_name, role], (err, result) => {
            if (err) {
                console.error('User Creation Error:', err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'User created successfully', id: result.insertId });
        });
    } catch (err) {
        console.error('Bcrypt Error:', err);
        res.status(500).json({ error: 'Error processing password' });
    }
});

app.get('/api/users', (req, res) => {
    db.query('SELECT id, username, full_name, role, created_at FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// --- ENQUIRY ROUTES ---
app.post('/api/enquiries', (req, res) => {
    const { parent_name, phone_number, child_age, city, message } = req.body;
    const query = 'INSERT INTO enquiries (parent_name, phone_number, child_age, city, message) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [parent_name, phone_number, child_age, city, message], (err, result) => {
        if (err) {
            console.error('Enquiry Error:', err);
            return res.status(500).json({ error: err.message, detail: 'Check if columns parent_name, phone_number, child_age, city, message exist in enquiries table' });
        }
        res.json({ message: 'Enquiry submitted successfully', id: result.insertId });
    });
});

app.patch('/api/enquiries/:id', (req, res) => {
    const { status, updated_by } = req.body;
    const query = 'UPDATE enquiries SET status = ?, updated_by = ? WHERE id = ?';
    db.query(query, [status, updated_by, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Status updated' });
    });
});

app.get('/api/enquiries', (req, res) => {
    const query = `
        SELECT e.*, u.full_name as updated_by_name 
        FROM enquiries e 
        LEFT JOIN users u ON e.updated_by = u.id 
        ORDER BY e.created_at DESC`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// --- PROGRAM (COURSE) ROUTES ---
app.get('/api/programs', (req, res) => {
    db.query('SELECT * FROM programs ORDER BY display_order ASC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/public/programs/:slug', (req, res) => {
    db.query('SELECT * FROM programs WHERE slug = ?', [req.params.slug], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Program not found' });
        res.json(results[0]);
    });
});

app.post('/api/programs', (req, res) => {
    const { title, description, icon_name, display_order, image_url, full_description, overview_points, duration, level, timing, price, slug, batch_size } = req.body;
    const query = 'INSERT INTO programs (title, description, icon_name, display_order, image_url, full_description, overview_points, duration, level, timing, price, slug, batch_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [title, description, icon_name, display_order, image_url, full_description, overview_points, duration, level, timing, price, slug, batch_size], (err, result) => {
        if (err) {
            console.error('Program Create Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Program created', id: result.insertId });
    });
});

app.put('/api/programs/:id', (req, res) => {
    const { title, description, icon_name, display_order, image_url, full_description, overview_points, duration, level, timing, price, slug, batch_size } = req.body;
    const query = 'UPDATE programs SET title=?, description=?, icon_name=?, display_order=?, image_url=?, full_description=?, overview_points=?, duration=?, level=?, timing=?, price=?, slug=?, batch_size=? WHERE id=?';
    db.query(query, [title, description, icon_name, display_order, image_url, full_description, overview_points, duration, level, timing, price, slug, batch_size, req.params.id], (err, result) => {
        if (err) {
            console.error('Program Update Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Program updated' });
    });
});

app.delete('/api/programs/:id', (req, res) => {
    db.query('DELETE FROM programs WHERE id=?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Program deleted' });
    });
});

// --- PUBLIC BLOG ROUTES ---
app.get('/api/public/blogs', (req, res) => {
    db.query('SELECT b.*, u.full_name as author_name FROM blogs b LEFT JOIN users u ON b.author_id = u.id WHERE b.status = "published" ORDER BY b.created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/public/blogs/:slug', (req, res) => {
    db.query('SELECT b.*, u.full_name as author_name FROM blogs b LEFT JOIN users u ON b.author_id = u.id WHERE b.slug = ? AND b.status = "published"', [req.params.slug], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Blog not found' });
        res.json(results[0]);
    });
});
app.get('/api/blogs', (req, res) => {
    const { author_id } = req.query;
    let query = 'SELECT b.*, u.full_name as author_name FROM blogs b LEFT JOIN users u ON b.author_id = u.id';
    let params = [];

    if (author_id) {
        query += ' WHERE b.author_id = ?';
        params.push(author_id);
    }
    
    query += ' ORDER BY b.created_at DESC';

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Fetch Blogs Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
app.post('/api/blogs', (req, res) => {
    const { title, slug, content, author_id, featured_image, seo_title, seo_description, seo_keywords, status } = req.body;
    const query = `INSERT INTO blogs 
        (title, slug, content, author_id, featured_image, seo_title, seo_description, seo_keywords, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        title=?, content=?, featured_image=?, seo_title=?, seo_description=?, seo_keywords=?, status=?`;
    
    const values = [
        title, slug, content, author_id, featured_image, seo_title, seo_description, seo_keywords, status,
        title, content, featured_image, seo_title, seo_description, seo_keywords, status
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Blog Save Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Blog saved successfully', id: result.insertId || result.id });
    });
});

// --- UPLOAD ROUTE ---
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: req.file.path });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
