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
    
    // Get all posts by the current user
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $current_user = getCurrentUser();
    if (!$current_user) {
        echo json_encode(['error' => 'Not authenticated']);
        exit;
    }
    
    $action = $_POST['action'] ?? '';
    $user_id = $current_user['id'];
    
    if ($action === 'delete') {
        $post_id = intval($_POST['post_id']);
        
        // Verify the post belongs to the current user
        $check = $conn->query("SELECT id FROM posts WHERE id = $post_id AND user_id = $user_id");
        if ($check->num_rows === 0) {
            echo json_encode(['error' => 'Post not found or unauthorized']);
            exit;
        }
        
        // Delete the post and all related data
        $conn->query("DELETE FROM comments WHERE post_id = $post_id");
        $conn->query("DELETE FROM likes WHERE post_id = $post_id");
        $conn->query("DELETE FROM notifications WHERE post_id = $post_id");
        $conn->query("DELETE FROM posts WHERE id = $post_id");
        
        // Update user's post count
        $conn->query("UPDATE users SET posts_count = posts_count - 1 WHERE id = $user_id");
        
        // Update posts count in response for real-time update
        $count_result = $conn->query("SELECT posts_count FROM users WHERE id = $user_id");
        $count_data = $count_result->fetch_assoc();
        
        echo json_encode(['success' => true, 'posts_count' => $count_data['posts_count']]);
    }
    
    if ($action === 'archive') {
        $post_id = intval($_POST['post_id']);
        
        // Verify the post belongs to the current user
        $check = $conn->query("SELECT id FROM posts WHERE id = $post_id AND user_id = $user_id");
        if ($check->num_rows === 0) {
            echo json_encode(['error' => 'Post not found or unauthorized']);
            exit;
        }
        
        // Archive the post
        $conn->query("UPDATE posts SET is_archived = 1 WHERE id = $post_id");
        
        echo json_encode(['success' => true]);
    }
    
    if ($action === 'unarchive') {
        $post_id = intval($_POST['post_id']);
        
        // Verify the post belongs to the current user
        $check = $conn->query("SELECT id FROM posts WHERE id = $post_id AND user_id = $user_id");
        if ($check->num_rows === 0) {
            echo json_encode(['error' => 'Post not found or unauthorized']);
            exit;
        }
        
        // Unarchive the post
        $conn->query("UPDATE posts SET is_archived = 0 WHERE id = $post_id");
        
        echo json_encode(['success' => true]);
    }
}
?>