-- MASTER SCHEMA FOR STUDYCUBS
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS programs;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'sales', 'writer') DEFAULT 'sales',
    status ENUM('active', 'disabled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    age_group VARCHAR(100),
    short_description TEXT,
    long_description TEXT,
    highlights JSON,
    duration VARCHAR(100),
    timing VARCHAR(100),
    schedule VARCHAR(255),
    batch_size VARCHAR(100),
    learning_outcomes JSON,
    image_url VARCHAR(255),
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    thumbnail VARCHAR(255),
    author_id INT,
    status ENUM('draft', 'published') DEFAULT 'published',
    seo_title VARCHAR(255),
    meta_description TEXT,
    keywords VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    source VARCHAR(100) DEFAULT 'website',
    notes TEXT,
    status ENUM('new', 'contacted', 'demo-scheduled', 'converted', 'rejected') DEFAULT 'new',
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- INITIAL DATA
INSERT INTO users (name, email, password, role, status) VALUES 
('Arsalan Admin', 'arsalan@studycubs.com', '123@Arsalan', 'admin', 'active'),
('Sales Intern', 'sales@studycubs.com', 'sales123', 'sales', 'active'),
('Content Writer', 'writer@studycubs.com', 'writer123', 'writer', 'active');
