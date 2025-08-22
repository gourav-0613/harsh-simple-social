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
    
    // Get all archived posts by the current user
    $sql = "SELECT p.*, u.profile_picture, u.username as post_username,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.user_id = $user_id AND p.is_archived = 1
            ORDER BY p.created_at DESC";
    
    $result = $conn->query($sql);
    $posts = [];
    
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }
    
    echo json_encode($posts);
}
?>