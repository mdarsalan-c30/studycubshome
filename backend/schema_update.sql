-- Update tables for advanced Program and Blog features
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS programs;

CREATE TABLE programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    age_group VARCHAR(100),
    short_description TEXT,
    long_description TEXT,
    highlights JSON, -- JSON array of strings
    duration VARCHAR(100),
    timing VARCHAR(100),
    schedule VARCHAR(255),
    batch_size VARCHAR(100), -- 1:3 or 1:1
    learning_outcomes JSON, -- JSON array of strings
    image_url VARCHAR(255),
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT, -- For rich text HTML
    thumbnail VARCHAR(255),
    author_id INT,
    status ENUM('draft', 'published') DEFAULT 'draft',
    -- SEO Fields
    seo_title VARCHAR(255),
    meta_description TEXT,
    keywords VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
