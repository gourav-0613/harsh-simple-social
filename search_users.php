<?php
include "config/connect.php";
include "config/auth.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $current_user = getCurrentUser();
    if (!$current_user) {
        echo json_encode(['error' => 'Not authenticated']);
        exit;
    }
    
    $query = $_GET['q'] ?? '';
    $query = trim($query);
    
    if (empty($query)) {
        echo json_encode([]);
        exit;
    }
    
    // Use prepared statements to prevent SQL injection
    $search_term = "%$query%";
    $current_user_id = $current_user['id'];
    
    $sql = "SELECT id, username, firstName, lastName, profile_picture, followers_count
            FROM users 
            WHERE (username LIKE ? OR firstName LIKE ? OR lastName LIKE ?)
            AND id != ?
            ORDER BY followers_count DESC, username ASC
            LIMIT 20";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $search_term, $search_term, $search_term, $current_user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    
    echo json_encode($users);
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
