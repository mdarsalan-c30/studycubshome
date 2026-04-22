-- Update StudyCubs Database for Role-Based Access

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Update Users Table to include 'sales' role
ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'writer', 'sales') DEFAULT 'writer';

-- 2. Update Enquiries Table Statuses
ALTER TABLE enquiries MODIFY COLUMN status ENUM(
    'new', 
    'contacted', 
    'ringed bell', 
    'no answer', 
    'not interested', 
    'soch ke batayega', 
    'follow up 1', 
    'follow up 2', 
    'others'
) DEFAULT 'new';

SET FOREIGN_KEY_CHECKS = 1;
