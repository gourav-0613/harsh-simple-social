<?php
include '../config/connect.php';
include '../config/auth.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $current_user = getCurrentUser();
    if (!$current_user) {
        echo json_encode(['error' => 'Not authenticated']);
        exit;
    }
    
    $user_id = $current_user['id'];
    
    // Get notifications for current user
    $sql = "SELECT * FROM notifications 
            WHERE user_id = $user_id 
            ORDER BY created_at DESC 
            LIMIT 50";
    
    $result = $conn->query($sql);
    $notifications = [];
    
    while ($row = $result->fetch_assoc()) {
        $notifications[] = $row;
    }
    
    echo json_encode($notifications);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $current_user = getCurrentUser();
    if (!$current_user) {
        echo json_encode(['error' => 'Not authenticated']);
        exit;
    }
    
    $action = $_POST['action'] ?? '';
    $user_id = $current_user['id'];
    
    if ($action === 'mark_read') {
        $notification_id = intval($_POST['notification_id']);
        
        $conn->query("UPDATE notifications SET is_read = 1 WHERE id = $notification_id AND user_id = $user_id");
        
        echo json_encode(['success' => true]);
    }
    
    if ($action === 'mark_all_read') {
        $conn->query("UPDATE notifications SET is_read = 1 WHERE user_id = $user_id");
        
        echo json_encode(['success' => true]);
    }
}
?>