<?php
include '../config/connect.php';
include '../config/auth.php';

header('Content-Type: application/json');

$current_user = getCurrentUser();
if (!$current_user) {
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get current privacy setting
    $user_id = $current_user['id'];
    $result = $conn->query("SELECT is_private FROM users WHERE id = $user_id");
    
    if ($result && $row = $result->fetch_assoc()) {
        echo json_encode([
            'success' => true,
            'is_private' => (bool)$row['is_private']
        ]);
    } else {
        echo json_encode(['error' => 'Could not load privacy setting']);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'update_privacy') {
        $user_id = $current_user['id'];
        $is_private = intval($_POST['is_private']);
        
        $stmt = $conn->prepare("UPDATE users SET is_private = ? WHERE id = ?");
        $stmt->bind_param("ii", $is_private, $user_id);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'is_private' => (bool)$is_private
            ]);
        } else {
            echo json_encode(['error' => 'Could not update privacy setting']);
        }
        
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Invalid action']);
    }
}
?>