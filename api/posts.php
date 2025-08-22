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
    
    // Get posts from users that current user follows + own posts
    $sql = "SELECT p.*, u.profile_picture, u.username as post_username, u.firstName, u.lastName,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = $user_id) as user_liked,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.is_archived = 0 AND p.user_id IN (
                SELECT following_id FROM follows WHERE follower_id = $user_id
                UNION 
                SELECT $user_id
            )
            ORDER BY p.created_at DESC 
            LIMIT 20";
    
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
    
    if ($action === 'like') {
        $post_id = intval($_POST['post_id']);
        $user_id = $current_user['id'];
        
        // Check if already liked
        $check = $conn->query("SELECT id FROM likes WHERE user_id = $user_id AND post_id = $post_id");
        
        if ($check->num_rows > 0) {
            // Unlike
            $conn->query("DELETE FROM likes WHERE user_id = $user_id AND post_id = $post_id");
            $conn->query("UPDATE posts SET likes_count = likes_count - 1 WHERE id = $post_id");
            $liked = false;
        } else {
            // Like
            $conn->query("INSERT INTO likes (user_id, post_id) VALUES ($user_id, $post_id)");
            $conn->query("UPDATE posts SET likes_count = likes_count + 1 WHERE id = $post_id");
            $liked = true;
            
            // Create notification
            $post_result = $conn->query("SELECT user_id, username FROM posts WHERE id = $post_id");
            $post_data = $post_result->fetch_assoc();
            
            if ($post_data['user_id'] != $user_id) {
                $from_username = $current_user['username'];
                $message = "$from_username liked your post";
                $conn->query("INSERT INTO notifications (user_id, type, from_user_id, from_username, post_id, message) 
                             VALUES ({$post_data['user_id']}, 'like', $user_id, '$from_username', $post_id, '$message')");
            }
        }
        
        // Get updated like count
        $result = $conn->query("SELECT likes_count FROM posts WHERE id = $post_id");
        $post = $result->fetch_assoc();
        
        echo json_encode(['liked' => $liked, 'likes_count' => $post['likes_count']]);
    }
    
    if ($action === 'comment') {
        $post_id = intval($_POST['post_id']);
        $comment_text = mysqli_real_escape_string($conn, $_POST['comment_text']);
        $user_id = $current_user['id'];
        $username = $current_user['username'];
        
        $conn->query("INSERT INTO comments (user_id, post_id, username, comment_text) 
                     VALUES ($user_id, $post_id, '$username', '$comment_text')");
        $conn->query("UPDATE posts SET comments_count = comments_count + 1 WHERE id = $post_id");
        
        // Create notification
        $post_result = $conn->query("SELECT user_id FROM posts WHERE id = $post_id");
        $post_data = $post_result->fetch_assoc();
        
        if ($post_data['user_id'] != $user_id) {
            $message = "$username commented on your post";
            $conn->query("INSERT INTO notifications (user_id, type, from_user_id, from_username, post_id, message) 
                         VALUES ({$post_data['user_id']}, 'comment', $user_id, '$username', $post_id, '$message')");
        }
        
        echo json_encode(['success' => true]);
    }
}
?>