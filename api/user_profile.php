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
    
    // Get user profile data
    $sql = "SELECT id, username, firstName, lastName, bio, profile_picture, 
            followers_count, following_count, posts_count, is_private
            FROM users WHERE username = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['error' => 'User not found']);
        exit;
    }
    
    $user = $result->fetch_assoc();
    
    // Check if current user is following this user
    $current_user = getCurrentUser();
    $is_following = false;
    $follow_status = 'none'; // none, following, requested
    
    if ($current_user) {
        $follow_check = $conn->prepare("SELECT id FROM follows WHERE follower_id = ? AND following_id = ?");
        $follow_check->bind_param("ii", $current_user['id'], $user['id']);
        $follow_check->execute();
        
        if ($follow_check->get_result()->num_rows > 0) {
            $is_following = true;
            $follow_status = 'following';
        } else {
            // Check for pending request
            $request_check = $conn->prepare("SELECT id FROM follow_requests WHERE requester_id = ? AND requested_id = ?");
            $request_check->bind_param("ii", $current_user['id'], $user['id']);
            $request_check->execute();
            
            if ($request_check->get_result()->num_rows > 0) {
                $follow_status = 'requested';
            }
        }
    }
    
    $user['is_following'] = $is_following;
    $user['follow_status'] = $follow_status;
    
    echo json_encode($user);
}
?>