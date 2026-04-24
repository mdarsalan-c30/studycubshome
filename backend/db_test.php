<?php
require_once 'db.php';

try {
    $pdo->query("SELECT 1");
    echo json_encode(["status" => "success", "message" => "Database connection working!"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
