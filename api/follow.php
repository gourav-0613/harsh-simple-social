<?php
include '../config/connect.php';
include '../config/auth.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $current_user = getCurrentUser();
    if (!$current_user) {
        echo json_encode(['error' => 'Not authenticated']);
        exit;
    }
    
    $action = $_POST['action'] ?? '';
    $target_user_id = intval($_POST['user_id']);
    $current_user_id = $current_user['id'];
    
    if ($action === 'follow') {
        // Check if already following
        $check = $conn->query("SELECT id FROM follows WHERE follower_id = $current_user_id AND following_id = $target_user_id");
        
        if ($check->num_rows > 0) {
            // Unfollow
            $conn->query("DELETE FROM follows WHERE follower_id = $current_user_id AND following_id = $target_user_id");
            $conn->query("UPDATE users SET followers_count = followers_count - 1 WHERE id = $target_user_id");
            $conn->query("UPDATE users SET following_count = following_count - 1 WHERE id = $current_user_id");
            $following = false;
        } else {
            // Follow
            $conn->query("INSERT INTO follows (follower_id, following_id) VALUES ($current_user_id, $target_user_id)");
            $conn->query("UPDATE users SET followers_count = followers_count + 1 WHERE id = $target_user_id");
            $conn->query("UPDATE users SET following_count = following_count + 1 WHERE id = $current_user_id");
            $following = true;
            
            // Create notification
            $from_username = $current_user['username'];
            $message = "$from_username started following you";
            $conn->query("INSERT INTO notifications (user_id, type, from_user_id, from_username, message) 
                         VALUES ($target_user_id, 'follow', $current_user_id, '$from_username', '$message')");
        }
        
        echo json_encode(['following' => $following]);
    }
}
?>