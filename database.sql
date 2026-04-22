-- StudyCubs CLEAN Database Schema
-- Run this in PHPMyAdmin

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS enquiries;
DROP TABLE IF EXISTS programs;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('admin', 'writer') DEFAULT 'writer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content LONGTEXT,
    author_id INT,
    status ENUM('draft', 'pending', 'published') DEFAULT 'draft',
    featured_image VARCHAR(255),
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    child_age INT,
    city VARCHAR(100),
    message TEXT,
    status ENUM('new', 'contacted', 'closed') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    age_range VARCHAR(50),
    level VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, full_name, role) 
VALUES ('admin', '$2b$10$pOrUvDTo29uprY0QzBHmq.QSiK/3hcyIBLSxtZSQz.bQe/fDcxASO', 'Super Admin', 'admin');
