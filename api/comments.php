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
?>