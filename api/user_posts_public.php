<?php
include '../config/connect.php';
include '../config/auth.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $username = $_GET['username'] ?? '';
    
    if (empty($username)) {
        echo json_encode(['error' => 'Username required']);
        exit;
    }
    
    // Get user ID
    $user_result = $conn->query("SELECT id, is_private FROM users WHERE username = '$username'");
    if ($user_result->num_rows === 0) {
        echo json_encode(['error' => 'User not found']);
        exit;
    }
    
    $user_data = $user_result->fetch_assoc();
    $user_id = $user_data['id'];
    $is_private = $user_data['is_private'];
    
    // Check if current user can view posts
    $current_user = getCurrentUser();
    $can_view = true;
    
    if ($is_private && $current_user) {
        if ($current_user['id'] != $user_id) {
            // Check if following
            $follow_check = $conn->query("SELECT id FROM follows WHERE follower_id = {$current_user['id']} AND following_id = $user_id");
            $can_view = $follow_check->num_rows > 0;
        }
    } elseif ($is_private && !$current_user) {
        $can_view = false;
    }
    
    if (!$can_view) {
        echo json_encode(['error' => 'Private account']);
        exit;
    }
    
    // Get posts
    $sql = "SELECT p.*, u.profile_picture, u.username as post_username,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.user_id = $user_id AND p.is_archived = 0
            ORDER BY p.created_at DESC";
    
    $result = $conn->query($sql);
    $posts = [];
    
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }
    
    echo json_encode($posts);
}
?>