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
    
    $query = $_GET['q'] ?? '';
    $query = mysqli_real_escape_string($conn, $query);
    
    if (empty($query)) {
        echo json_encode([]);
        exit;
    }
    
    // Search users by username, firstName, or lastName
    $sql = "SELECT id, username, firstName, lastName, profile_picture, followers_count
            FROM users 
            WHERE username LIKE '%$query%' 
            OR firstName LIKE '%$query%' 
            OR lastName LIKE '%$query%'
            ORDER BY followers_count DESC
            LIMIT 20";
    
    $result = $conn->query($sql);
    $users = [];
    
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    
    echo json_encode($users);
}
?>