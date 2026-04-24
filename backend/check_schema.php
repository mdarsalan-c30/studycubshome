<?php
require_once 'db.php';
try {
    $stmt = $pdo->query("DESCRIBE users");
    echo json_encode($stmt->fetchAll());
} catch (Exception $e) {
    echo $e->getMessage();
}
?>
