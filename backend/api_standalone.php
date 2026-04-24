<?php
// STANDALONE BULLETPROOF API
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

// DB CONFIG - Update if needed
$host = 'localhost';
$dbname = 'studycubs_db';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die(json_encode(["success" => false, "error" => "Database connection failed: " . $e->getMessage()]));
}

function sendError($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(["success" => false, "error" => $msg]);
    exit;
}

$action = $_GET['action'] ?? '';

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
                $user = $stmt->fetch();
                if ($user && $user['status'] === 'active') return $user;
            } catch (Exception $e) { return null; }
        }
    }
    return null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if ($action === 'login') {
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
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

    if ($action === 'submit_lead') {
        try {
            $stmt = $pdo->prepare("INSERT INTO leads (name, phone, email, source, notes) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$data['name'] ?? '', $data['phone'] ?? '', $data['email'] ?? '', $data['source'] ?? 'website', $data['notes'] ?? '']);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
        exit;
    }

    $user = getAuthenticatedUser($pdo);
    if (!$user) sendError("Unauthorized access.", 401);

    if ($action === 'add_user' && $user['role'] === 'admin') {
        try {
            $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
            $stmt->execute([$data['name'] ?? '', $data['email'] ?? '', $data['password'] ?? '', $data['role'] ?? 'sales']);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
        exit;
    }

    if ($action === 'add_blog' && in_array($user['role'], ['admin', 'writer'])) {
        try {
            $stmt = $pdo->prepare("INSERT INTO blogs (title, content, thumbnail, author_id, status, seo_title, meta_description, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$data['title'] ?? 'Untitled', $data['content'] ?? '', $data['thumbnail'] ?? '', $user['id'], 'published', $data['seo_title'] ?? '', $data['meta_description'] ?? '', $data['keywords'] ?? '']);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
        exit;
    }

    if ($action === 'add_program' && $user['role'] === 'admin') {
        try {
            $stmt = $pdo->prepare("INSERT INTO programs (title, age_group, short_description, long_description, highlights, duration, timing, schedule, batch_size, learning_outcomes, image_url, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$data['title'] ?? '', $data['age_group'] ?? '', $data['short_description'] ?? '', $data['long_description'] ?? '', json_encode($data['highlights'] ?? []), $data['duration'] ?? '', $data['timing'] ?? '', $data['schedule'] ?? '', $data['batch_size'] ?? '', json_encode($data['learning_outcomes'] ?? []), $data['image_url'] ?? '', $data['price'] ?? 0]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
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

    if ($action === 'update_user_status' && $user['role'] === 'admin') {
        try {
            $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE id = ?");
            $stmt->execute([$data['status'], $data['id']]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) { sendError($e->getMessage()); }
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'get_programs') {
        $stmt = $pdo->query("SELECT * FROM programs ORDER BY created_at DESC");
        echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
        exit;
    }

    if ($action === 'get_program_detail') {
        $id = $_GET['id'] ?? 0;
        $stmt = $pdo->prepare("SELECT * FROM programs WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true, "data" => $stmt->fetch()]);
        exit;
    }

    if ($action === 'get_blogs') {
        $stmt = $pdo->query("SELECT id, title, thumbnail, created_at FROM blogs WHERE status = 'published' ORDER BY created_at DESC");
        echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
        exit;
    }

    $user = getAuthenticatedUser($pdo);
    if (!$user) sendError("Unauthorized", 401);

    if ($action === 'get_all_blogs') {
        $stmt = $pdo->query("SELECT b.*, u.name as author_name FROM blogs b LEFT JOIN users u ON b.author_id = u.id ORDER BY b.created_at DESC");
        echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
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
        echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
        exit;
    }

    if ($action === 'get_users' && $user['role'] === 'admin') {
        $stmt = $pdo->query("SELECT id, name, email, role, status FROM users");
        echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
        exit;
    }
}
?>
