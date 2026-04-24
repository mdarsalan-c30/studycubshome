<?php
// dashboard.php - Admin Dashboard for Lead Management
require_once 'db.php';

// Simple password protection (In production, use session and actual login)
// $password = $_GET['pass'] ?? '';
// if ($password !== 'admin123') { die("Unauthorized"); }

$leads = $pdo->query("SELECT * FROM leads ORDER BY created_at DESC")->fetchAll();
$enquiries = $pdo->query("SELECT * FROM enquiries ORDER BY created_at DESC")->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>StudyCubs Admin Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white p-8">
    <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold mb-8">StudyCubs Admin <span class="text-purple-500">Dashboard</span></h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Leads Section -->
            <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <h2 class="text-xl font-bold mb-4 flex items-center justify-between">
                    Recent Leads
                    <span class="text-xs bg-purple-600 px-2 py-1 rounded"><?php echo count($leads); ?> Total</span>
                </h2>
                <div class="space-y-4">
                    <?php foreach ($leads as $lead): ?>
                    <div class="p-4 bg-gray-700 rounded-xl border border-gray-600">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="font-bold"><?php echo htmlspecialchars($lead['name']); ?></p>
                                <p class="text-sm text-gray-400"><?php echo htmlspecialchars($lead['phone']); ?></p>
                                <p class="text-xs text-gray-500"><?php echo htmlspecialchars($lead['email']); ?></p>
                            </div>
                            <span class="text-xs uppercase px-2 py-1 bg-green-900 text-green-300 rounded"><?php echo $lead['status']; ?></span>
                        </div>
                        <p class="text-xs text-gray-500 mt-2">Source: <?php echo $lead['source']; ?> | <?php echo $lead['created_at']; ?></p>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Enquiries Section -->
            <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <h2 class="text-xl font-bold mb-4 flex items-center justify-between">
                    Enquiries
                    <span class="text-xs bg-green-600 px-2 py-1 rounded"><?php echo count($enquiries); ?> Total</span>
                </h2>
                <div class="space-y-4">
                    <?php foreach ($enquiries as $enquiry): ?>
                    <div class="p-4 bg-gray-700 rounded-xl border border-gray-600">
                        <p class="font-bold"><?php echo htmlspecialchars($enquiry['name']); ?> <span class="text-xs text-gray-500">(<?php echo $enquiry['type']; ?>)</span></p>
                        <p class="text-sm text-gray-400"><?php echo htmlspecialchars($enquiry['message']); ?></p>
                        <p class="text-xs text-gray-500 mt-1"><?php echo $enquiry['created_at']; ?></p>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
