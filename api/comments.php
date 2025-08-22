<?php
include '../config/connect.php';
include '../config/auth.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $post_id = intval($_GET['post_id']);
    
    $sql = "SELECT c.*, u.profile_picture 
            FROM comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.post_id = $post_id 
            ORDER BY c.created_at ASC";
    
    $result = $conn->query($sql);
    $comments = [];
    
    while ($row = $result->fetch_assoc()) {
        $comments[] = $row;
    }
    
    echo json_encode($comments);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];
    
    if ($action === 'comment') {
        $post_id = intval($_POST['post_id']);
        $comment_text = mysqli_real_escape_string($conn, $_POST['comment_text']);
        $user_id = $current_user['id'];
        $username = $current_user['username'];
        
        $conn->query("INSERT INTO comments (user_id, post_id, username, comment_text) 
                     VALUES ($user_id, $post_id, '$username', '$comment_text')");
        
        // Update comments count in posts table
        $conn->query("UPDATE posts SET comments_count = (SELECT COUNT(*) FROM comments WHERE post_id = $post_id) WHERE id = $post_id");
        
        // Create notification
        $post_result = $conn->query("SELECT user_id FROM posts WHERE id = $post_id");
        $post = $post_result->fetch_assoc();
        
        if ($post['user_id'] != $user_id) {
            $conn->query("INSERT INTO notifications (user_id, type, message, post_id) 
                         VALUES ({$post['user_id']}, 'comment', '$username commented on your post', $post_id)");
        }
        
        echo json_encode(['success' => true]);
    }
    
    if ($action === 'delete') {
        $comment_id = intval($_POST['comment_id']);
        $user_id = $current_user['id'];
        
        // Get comment details and verify ownership
        $comment_result = $conn->query("SELECT post_id FROM comments WHERE id = $comment_id AND user_id = $user_id");
        
        if ($comment_result->num_rows === 0) {
            echo json_encode(['error' => 'Comment not found or unauthorized']);
            exit;
        }
        
        $comment = $comment_result->fetch_assoc();
        $post_id = $comment['post_id'];
        
        // Delete the comment
        $conn->query("DELETE FROM comments WHERE id = $comment_id");
        
        // Update comments count in posts table
        $conn->query("UPDATE posts SET comments_count = (SELECT COUNT(*) FROM comments WHERE post_id = $post_id) WHERE id = $post_id");
        
        echo json_encode(['success' => true]);
    }
}
?>