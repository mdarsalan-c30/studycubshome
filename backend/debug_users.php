<?php
require_once 'db.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT id, name, email, password, role FROM users");
    $users = $stmt->fetchAll();
    echo json_encode(["status" => "success", "data" => $users]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
