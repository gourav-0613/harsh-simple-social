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
    
    // Get all posts that the current user has liked
    $sql = "SELECT p.*, u.profile_picture, u.username as post_username, u.firstName, u.lastName,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = $user_id) as user_liked,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
            l.created_at as liked_at
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            JOIN likes l ON p.id = l.post_id
            WHERE l.user_id = $user_id AND p.is_archived = 0
            ORDER BY l.created_at DESC 
            LIMIT 50";
    
    $result = $conn->query($sql);
    $posts = [];
    
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }
    
    echo json_encode($posts);
}
?>