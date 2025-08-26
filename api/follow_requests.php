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
    $current_user_id = $current_user['id'];
    
    if ($action === 'send_request') {
        $target_user_id = intval($_POST['user_id']);
        
        // Check if request already exists
        $check = $conn->query("SELECT id FROM follow_requests WHERE requester_id = $current_user_id AND requested_id = $target_user_id");
        
        if ($check->num_rows > 0) {
            echo json_encode(['error' => 'Request already sent']);
            exit;
        }
        
        // Check if already following
        $follow_check = $conn->query("SELECT id FROM follows WHERE follower_id = $current_user_id AND following_id = $target_user_id");
        
        if ($follow_check->num_rows > 0) {
            echo json_encode(['error' => 'Already following']);
            exit;
        }
        
        // Send follow request
        $conn->query("INSERT INTO follow_requests (requester_id, requested_id) VALUES ($current_user_id, $target_user_id)");
        
        // Create notification
        $from_username = $current_user['username'];
        $message = "$from_username sent you a follow request";
        $conn->query("INSERT INTO notifications (user_id, type, from_user_id, from_username, message) 
                     VALUES ($target_user_id, 'follow_request', $current_user_id, '$from_username', '$message')");
        
        echo json_encode(['success' => true, 'status' => 'requested']);
    }
    
    if ($action === 'accept_request') {
        $requester_id = intval($_POST['requester_id']);
        
        // Check if request exists
        $check = $conn->query("SELECT id FROM follow_requests WHERE requester_id = $requester_id AND requested_id = $current_user_id");
        
        if ($check->num_rows === 0) {
            echo json_encode(['error' => 'Request not found']);
            exit;
        }
        
        // Accept the request - create follow relationship
        $conn->query("INSERT INTO follows (follower_id, following_id) VALUES ($requester_id, $current_user_id)");
        $conn->query("UPDATE users SET followers_count = followers_count + 1 WHERE id = $current_user_id");
        $conn->query("UPDATE users SET following_count = following_count + 1 WHERE id = $requester_id");
        
        // Remove the request
        $conn->query("DELETE FROM follow_requests WHERE requester_id = $requester_id AND requested_id = $current_user_id");
        
        // Create notification
        $from_username = $current_user['username'];
        $message = "$from_username accepted your follow request";
        $conn->query("INSERT INTO notifications (user_id, type, from_user_id, from_username, message) 
                     VALUES ($requester_id, 'follow_accept', $current_user_id, '$from_username', '$message')");
        
        echo json_encode(['success' => true]);
    }
    
    if ($action === 'decline_request') {
        $requester_id = intval($_POST['requester_id']);
        
        // Remove the request
        $conn->query("DELETE FROM follow_requests WHERE requester_id = $requester_id AND requested_id = $current_user_id");
        
        echo json_encode(['success' => true]);
    }
    
    if ($action === 'cancel_request') {
        $target_user_id = intval($_POST['user_id']);
        
        // Remove the request
        $conn->query("DELETE FROM follow_requests WHERE requester_id = $current_user_id AND requested_id = $target_user_id");
        
        echo json_encode(['success' => true]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $current_user = getCurrentUser();
    if (!$current_user) {
        echo json_encode(['error' => 'Not authenticated']);
        exit;
    }
    
    $user_id = $current_user['id'];
    
    // Get pending follow requests
    $sql = "SELECT fr.*, u.username, u.firstName, u.lastName, u.profile_picture
            FROM follow_requests fr
            JOIN users u ON fr.requester_id = u.id
            WHERE fr.requested_id = $user_id
            ORDER BY fr.created_at DESC";
    
    $result = $conn->query($sql);
    $requests = [];
    
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }
    
    echo json_encode($requests);
}
?>