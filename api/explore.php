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
    
    // Get popular posts from users that current user doesn't follow
    $sql = "SELECT p.*, u.profile_picture, u.username as post_username,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.user_id NOT IN (
                SELECT following_id FROM follows WHERE follower_id = $user_id
            ) AND p.user_id != $user_id
            ORDER BY likes_count DESC, p.created_at DESC 
            LIMIT 30";
    
    $result = $conn->query($sql);
    $posts = [];
    
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }
    
    echo json_encode($posts);
}
?>