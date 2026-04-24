<?php
/**
 * STUDYCUBS ULTIMATE STANDALONE API
 * This file handles Database Connection, Auto-Schema Fixes, and all Actions.
 */

error_reporting(E_ALL);
ini_set('display_errors', 0); // Keep it 0 to ensure valid JSON response

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

// --- DATABASE CONFIGURATION ---
// Production Database Configuration (Hostinger)
$host = 'localhost';
$db   = 'u778334688_studycubs';
$user = 'u778334688_studycubs';
$pass = 'Studycubs@2024';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    
    // 3. AUTO-FIX SCHEMA (Ensures all tables exist with correct columns)
    
    // USERS Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'sales', 'writer') DEFAULT 'sales',
        status ENUM('active', 'disabled') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Ensure 'status' column exists (for older versions)
    $res = $pdo->query("SHOW COLUMNS FROM users LIKE 'status'");
    if (!$res->fetch()) {
        $pdo->exec("ALTER TABLE users ADD COLUMN status ENUM('active', 'disabled') DEFAULT 'active'");
    }

    // PROGRAMS Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS programs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255),
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
    )");

    // Add slug column if missing
    $res = $pdo->query("SHOW COLUMNS FROM programs LIKE 'slug'");
    if (!$res->fetch()) {
        $pdo->exec("ALTER TABLE programs ADD COLUMN slug VARCHAR(255) AFTER title");
    }
    // Auto-fill slugs for existing programs that have none
    $pdo->exec("UPDATE programs SET slug = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(title,' ','-'),'&','and'),'/','-'),',',''),'.','')) WHERE slug IS NULL OR slug = ''");

    // BLOGS Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255),
        content LONGTEXT,
        thumbnail VARCHAR(255),
        author_id INT,
        status ENUM('draft', 'published') DEFAULT 'published',
        seo_title VARCHAR(255),
        meta_description TEXT,
        keywords VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Add slug column to blogs if missing
    $res = $pdo->query("SHOW COLUMNS FROM blogs LIKE 'slug'");
    if (!$res->fetch()) {
        $pdo->exec("ALTER TABLE blogs ADD COLUMN slug VARCHAR(255) AFTER title");
    }
    // Auto-fill slugs for existing blogs that have none
    $pdo->exec("UPDATE blogs SET slug = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(title,' ','-'),'&','and'),'/','-'),',',''),'.','')) WHERE slug IS NULL OR slug = ''");

    // LEADS Table (Unified)
    $pdo->exec("CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        program VARCHAR(100),
        source VARCHAR(100) DEFAULT 'website',
        notes TEXT,
        status ENUM('new', 'contacted', 'follow-up-1', 'follow-up-2', 'demo-scheduled', 'converted', 'rejected') DEFAULT 'new',
        assigned_to INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    try { $pdo->exec("ALTER TABLE leads ADD COLUMN program VARCHAR(100) AFTER email"); } catch(Exception $e) {}

    // MATERIALS Table (Unified)
    $pdo->exec("CREATE TABLE IF NOT EXISTS materials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        description TEXT,
        type ENUM('pdf', 'image', 'video', 'link') DEFAULT 'pdf',
        file_url VARCHAR(255) NOT NULL,
        thumbnail_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // PAGES Table (Dynamic Content)
    $pdo->exec("CREATE TABLE IF NOT EXISTS pages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        content LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    // ONBOARDING_DOCS Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS onboarding_docs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('mou', 'offer_letter', 'batch_allocation') NOT NULL,
        teacher_name VARCHAR(255) NOT NULL,
        file_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Initial pages content if empty
    $count = $pdo->query("SELECT COUNT(*) FROM pages")->fetchColumn();
    if ($count == 0) {
        $stmt = $pdo->prepare("INSERT INTO pages (slug, title, content) VALUES (?, ?, ?)");
        $stmt->execute(['privacy-policy', 'Privacy Policy', '<h1>Privacy Policy</h1><p>Our commitment to your privacy...</p>']);
        $stmt->execute(['terms-of-service', 'Terms of Service', '<h1>Terms of Service</h1><p>Rules of using our platform...</p>']);
        $stmt->execute(['refund-policy', 'Refund Policy', '<h1>Refund Policy</h1><p>Information about refunds...</p>']);
    }
    // Seed default admin if none exists
    $count = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
    if ($count == 0) {
        $hashedPassword = password_hash('123@Arsalan', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->execute(['Md Arsalan', 'arsalan@studycubs.com', $hashedPassword, 'admin']);
    }


} catch (PDOException $e) {
    die(json_encode(["success" => false, "error" => "Critical System Error: " . $e->getMessage()]));
}

// --- HELPER FUNCTIONS ---
function sendError($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(["success" => false, "error" => $msg]);
    exit;
}

function getAuthenticatedUser($pdo) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (empty($authHeader)) {
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = base64_decode($matches[1]);
        $parts = explode(':', $token);
        if (count($parts) === 2) {
            $email = $parts[0];
            try {
                $stmt = $pdo->prepare("SELECT id, name, email, role, status FROM users WHERE email = ?");
                $stmt->execute([$email]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($user && $user['status'] === 'active') return $user;
            } catch (Exception $e) { return null; }
        }
    }
    return null;
}

// --- MAIN ROUTER ---
$action = $_GET['action'] ?? '';
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action === 'login') {
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user && $password === $user['password']) {
            if ($user['status'] !== 'active') sendError("Account disabled", 403);
            $token = base64_encode($user['email'] . ':' . $user['role']);
            echo json_encode([
                "success" => true,
                "token" => $token,
                "user" => ["id" => $user['id'], "name" => $user['name'], "email" => $user['email'], "role" => $user['role']]
            ]);
        } else { sendError("Invalid credentials", 401); }
        exit;
    }

    if ($action === 'submit_lead' || $action === 'submit_enquiry') {
        try {
            $stmt = $pdo->prepare("INSERT INTO leads (name, phone, email, source, notes, status) VALUES (?, ?, ?, ?, ?, 'new')");
            $stmt->execute([
                $data['name'] ?? 'Guest',
                $data['phone'] ?? '',
                $data['email'] ?? '',
                $data['source'] ?? ($action === 'submit_enquiry' ? 'Contact Page' : 'Website'),
                $data['notes'] ?? $data['message'] ?? ''
            ]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
        exit;
    }

    // --- Authenticated POST Actions ---
    $user = getAuthenticatedUser($pdo);
    if (!$user) sendError("Unauthorized access.", 401);

    if ($action === 'add_user' && $user['role'] === 'admin') {
        try {
            $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
            $stmt->execute([$data['name'], $data['email'], $data['password'], $data['role']]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
        exit;
    }

    if ($action === 'add_blog' || $action === 'update_blog') {
        try {
            // Generate slug from title
            $blogSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['title'])));
            $blogSlug = preg_replace('/-+/', '-', $blogSlug);
            $blogSlug = rtrim($blogSlug, '-');

            if ($action === 'update_blog') {
                $stmt = $pdo->prepare("UPDATE blogs SET title = ?, slug = ?, content = ?, thumbnail = ?, status = ?, seo_title = ?, meta_description = ?, keywords = ? WHERE id = ?");
                $stmt->execute([$data['title'], $blogSlug, $data['content'], $data['thumbnail'], $data['status'], $data['seo_title'], $data['meta_description'], $data['keywords'], $data['id']]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO blogs (title, slug, content, thumbnail, author_id, status, seo_title, meta_description, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$data['title'], $blogSlug, $data['content'], $data['thumbnail'], $user['id'], 'published', $data['seo_title'], $data['meta_description'], $data['keywords']]);
            }
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
        exit;
    }

    if ($action === 'add_program' || $action === 'update_program') {
        try {
            // Generate slug from title
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['title'])));
            $slug = preg_replace('/-+/', '-', $slug);
            $slug = rtrim($slug, '-');

            if ($action === 'update_program') {
                $stmt = $pdo->prepare("UPDATE programs SET title = ?, slug = ?, age_group = ?, short_description = ?, long_description = ?, highlights = ?, duration = ?, timing = ?, schedule = ?, batch_size = ?, learning_outcomes = ?, image_url = ?, price = ? WHERE id = ?");
                $stmt->execute([$data['title'], $slug, $data['age_group'], $data['short_description'], $data['long_description'], json_encode($data['highlights']), $data['duration'], $data['timing'], $data['schedule'], $data['batch_size'], json_encode($data['learning_outcomes']), $data['image_url'], $data['price'], $data['id']]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO programs (title, slug, age_group, short_description, long_description, highlights, duration, timing, schedule, batch_size, learning_outcomes, image_url, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$data['title'], $slug, $data['age_group'], $data['short_description'], $data['long_description'], json_encode($data['highlights']), $data['duration'], $data['timing'], $data['schedule'], $data['batch_size'], json_encode($data['learning_outcomes']), $data['image_url'], $data['price']]);
            }
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
        exit;
    }

    if ($action === 'add_material') {
        try {
            $title = $data['title'] ?? 'Untitled Material';
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
            $slug = preg_replace('/-+/', '-', $slug);

            $stmt = $pdo->prepare("INSERT INTO materials (title, slug, description, type, file_url, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $slug, $data['description'] ?? '', $data['type'] ?? 'pdf', $data['file_url'] ?? '', $data['thumbnail_url'] ?? '']);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
        exit;
    }

    if ($action === 'delete_material') {
        try {
            $stmt = $pdo->prepare("DELETE FROM materials WHERE id = ?");
            $stmt->execute([$data['id']]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
        exit;
    }

    if ($action === 'update_page' && $user['role'] === 'admin') {
        try {
            $stmt = $pdo->prepare("UPDATE pages SET title = ?, content = ? WHERE slug = ?");
            $stmt->execute([$data['title'], $data['content'], $data['slug']]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
        exit;
    }

    if ($action === 'add_page' && $user['role'] === 'admin') {
        try {
            $title = $data['title'];
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
            $slug = preg_replace('/-+/', '-', $slug);
            
            $stmt = $pdo->prepare("INSERT INTO pages (title, slug, content) VALUES (?, ?, ?)");
            $stmt->execute([$title, $slug, $data['content'] ?? '<h1>'.$title.'</h1><p>Start typing here...</p>']);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError("Page slug must be unique."); }
        exit;
    }

    if ($action === 'update_page' && $user['role'] === 'admin') {
        try {
            $title = $data['title'];
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
            $slug = preg_replace('/-+/', '-', $slug);
            
            $stmt = $pdo->prepare("UPDATE pages SET title = ?, slug = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([$title, $slug, $data['content'], $data['id']]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
        exit;
    }

    if ($action === 'delete_page' && $user['role'] === 'admin') {
        try {
            $stmt = $pdo->prepare("DELETE FROM pages WHERE id = ?");
            $stmt->execute([$data['id']]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
        exit;
    }

    if ($action === 'save_onboarding_doc' && $user['role'] === 'admin') {
        try {
            $stmt = $pdo->prepare("INSERT INTO onboarding_docs (type, teacher_name, file_url) VALUES (?, ?, ?)");
            $stmt->execute([$data['type'], $data['teacher_name'], $data['file_url']]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
        exit;
    }

    if ($action === 'get_onboarding_docs' && $user['role'] === 'admin') {
        $stmt = $pdo->query("SELECT * FROM onboarding_docs ORDER BY created_at DESC");
        echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }

    if ($action === 'update_lead_status') {
        try {
            $stmt = $pdo->prepare("UPDATE leads SET status = ? WHERE id = ?");
            $stmt->execute([$data['status'], $data['id']]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
        exit;
    }
} else {
    // --- Public GET Actions ---
    if ($action === 'get_programs') {
        $stmt = $pdo->query("SELECT * FROM programs ORDER BY created_at DESC");
        echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }

    if ($action === 'get_program' && isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM programs WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $p = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($p) echo json_encode(["success" => true, "data" => $p]);
        else sendError("Program not found", 404);
        exit;
    }

    // get_program_detail — supports both ?id=X and ?slug=abc (Public, no auth needed)
    if ($action === 'get_program_detail') {
        if (isset($_GET['slug']) && !empty($_GET['slug'])) {
            $stmt = $pdo->prepare("SELECT * FROM programs WHERE slug = ?");
            $stmt->execute([$_GET['slug']]);
        } elseif (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM programs WHERE id = ?");
            $stmt->execute([$_GET['id']]);
        } else {
            sendError("Missing id or slug", 400);
            exit;
        }
        $p = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($p) echo json_encode(["success" => true, "data" => $p]);
        else sendError("Program not found", 404);
        exit;
    }

    if ($action === 'get_blogs') {
        $stmt = $pdo->query("SELECT b.*, u.name as author_name FROM blogs b LEFT JOIN users u ON b.author_id = u.id WHERE b.status = 'published' ORDER BY b.created_at DESC");
        echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }

    if ($action === 'get_blog' && isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT b.*, u.name as author_name FROM blogs b LEFT JOIN users u ON b.author_id = u.id WHERE b.id = ?");
        $stmt->execute([$_GET['id']]);
        $b = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($b) echo json_encode(["success" => true, "data" => $b]);
        else sendError("Article not found", 404);
        exit;
    }

    // get_blog_detail — supports both ?slug=abc and ?id=X (Public, no auth needed)
    if ($action === 'get_blog_detail') {
        if (isset($_GET['slug']) && !empty($_GET['slug'])) {
            $stmt = $pdo->prepare("SELECT b.*, u.name as author_name FROM blogs b LEFT JOIN users u ON b.author_id = u.id WHERE b.slug = ?");
            $stmt->execute([$_GET['slug']]);
        } elseif (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT b.*, u.name as author_name FROM blogs b LEFT JOIN users u ON b.author_id = u.id WHERE b.id = ?");
            $stmt->execute([$_GET['id']]);
        } else {
            sendError("Missing id or slug", 400);
            exit;
        }
        $b = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($b) echo json_encode(["success" => true, "data" => $b]);
        else sendError("Article not found", 404);
        exit;
    }

    if ($action === 'get_materials') {
        $stmt = $pdo->query("SELECT * FROM materials ORDER BY created_at DESC");
        echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }

    if ($action === 'get_pages') {
        $stmt = $pdo->query("SELECT id, title, slug, updated_at FROM pages ORDER BY title ASC");
        echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }

    if ($action === 'get_page' && isset($_GET['slug'])) {
        $stmt = $pdo->prepare("SELECT * FROM pages WHERE slug = ?");
        $stmt->execute([$_GET['slug']]);
        $page = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($page) echo json_encode(["success" => true, "data" => $page]);
        else sendError("Page not found", 404);
        exit;
    }

    // --- Authenticated GET Actions ---
    $user = getAuthenticatedUser($pdo);
    if (!$user) sendError("Unauthorized", 401);

    if ($action === 'get_all_blogs') {
        $stmt = $pdo->query("SELECT b.*, u.name as author_name FROM blogs b LEFT JOIN users u ON b.author_id = u.id ORDER BY b.created_at DESC");
        echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }

    if ($action === 'get_stats') {
        $totalLeads = $pdo->query("SELECT COUNT(*) FROM leads")->fetchColumn();
        $newLeads = $pdo->query("SELECT COUNT(*) FROM leads WHERE status = 'new'")->fetchColumn();
        $converted = $pdo->query("SELECT COUNT(*) FROM leads WHERE status = 'converted'")->fetchColumn();
        echo json_encode(["success" => true, "data" => ["total_leads" => $totalLeads, "new_leads" => $newLeads, "converted" => $converted, "conversion_rate" => $totalLeads > 0 ? round(($converted / $totalLeads) * 100) . "%" : "0%"]]);
        exit;
    }

    if ($action === 'get_leads') {
        $stmt = $pdo->query("SELECT * FROM leads ORDER BY created_at DESC");
        echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }

    if ($action === 'get_pages') {
        $stmt = $pdo->query("SELECT * FROM pages");
        echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }

    if ($action === 'get_users' && $user['role'] === 'admin') {
        $stmt = $pdo->query("SELECT id, name, email, role, created_at FROM users");
        echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }
}
?>
