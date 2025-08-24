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
    
    // Get recent forwarded posts by current user (last 5)
    $sql = "SELECT fp.*, p.*, u.profile_picture, u.username as post_username,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
            FROM forwarded_posts fp
            JOIN posts p ON fp.post_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE fp.user_id = $user_id AND p.is_archived = 0
            ORDER BY fp.created_at DESC
            LIMIT 5";
    
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
    $post_id = intval($_POST['post_id']);
    $user_id = $current_user['id'];
    
    if ($action === 'forward') {
        // Check if already forwarded
        $check = $conn->query("SELECT id FROM forwarded_posts WHERE user_id = $user_id AND post_id = $post_id");
        
        if ($check->num_rows > 0) {
            // Remove forward (unforward)
            $conn->query("DELETE FROM forwarded_posts WHERE user_id = $user_id AND post_id = $post_id");
            echo json_encode(['success' => true, 'action' => 'unforwarded']);
        } else {
            // Forward the post
            $conn->query("INSERT INTO forwarded_posts (user_id, post_id) VALUES ($user_id, $post_id)");
            echo json_encode(['success' => true, 'action' => 'forwarded']);
        }
    }
}
?>