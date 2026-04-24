<?php
// doctor.php - Connection Diagnostic Tool
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'db.php';

echo "<h1>StudyCubs Diagnostic Tool</h1>";

// 1. Check DB Connection
try {
    $pdo->query("SELECT 1");
    echo "<p style='color:green'>✅ Database Connected Successfully!</p>";
} catch (Exception $e) {
    echo "<p style='color:red'>❌ Database Connection Failed: " . $e->getMessage() . "</p>";
}

// 2. Check Users Table
try {
    $stmt = $pdo->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "<p>Users Table Columns: " . implode(', ', $columns) . "</p>";
    if (in_array('status', $columns)) {
        echo "<p style='color:green'>✅ 'status' column found!</p>";
    } else {
        echo "<p style='color:red'>❌ 'status' column MISSING! Please run master_schema.sql</p>";
    }
} catch (Exception $e) {
    echo "<p style='color:red'>❌ Users table missing or error: " . $e->getMessage() . "</p>";
}

// 3. Check Admin User
try {
    $stmt = $pdo->prepare("SELECT id, name FROM users WHERE email = ?");
    $stmt->execute(['arsalan@studycubs.com']);
    $user = $stmt->fetch();
    if ($user) {
        echo "<p style='color:green'>✅ Admin user found: " . $user['name'] . "</p>";
    } else {
        echo "<p style='color:red'>❌ Admin user NOT FOUND! Please run master_schema.sql</p>";
    }
} catch (Exception $e) {
    echo "<p style='color:red'>❌ Error checking admin: " . $e->getMessage() . "</p>";
}

echo "<hr><p>If all are Green, your backend is ready. If not, fix the red ones first.</p>";
?>
