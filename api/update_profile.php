<?php
include '../config/connect.php';
include '../config/auth.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method']);
    exit;
}

$current_user = getCurrentUser();
if (!$current_user) {
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$current_user_id = $current_user['id'];
$username = trim($_POST['username'] ?? $current_user['username']);
$firstName = trim($_POST['firstName'] ?? $current_user['firstName']);
$lastName = trim($_POST['lastName'] ?? $current_user['lastName']);
$bio = trim($_POST['bio'] ?? $current_user['bio']);

$profile_picture_path = $current_user['profile_picture'];

// Validate username uniqueness if it's being changed
if ($username !== $current_user['username']) {
    $check_username = $conn->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
    $check_username->bind_param("si", $username, $current_user_id);
    $check_username->execute();
    $result = $check_username->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['error' => 'Username already exists. Please choose a different username.']);
        exit;
    }
    $check_username->close();
}

// --- Handle File Upload ---
if (isset($_FILES['profilePicture']) && $_FILES['profilePicture']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../uploads/';
    
    // Create uploads directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $fileName = uniqid() . '-' . basename($_FILES['profilePicture']['name']);
    $targetFile = $uploadDir . $fileName;
    
    // Check if it's a valid image
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
    $check = getimagesize($_FILES['profilePicture']['tmp_name']);
    
    if ($check !== false && in_array($imageFileType, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
        // Check file size (limit to 5MB)
        if ($_FILES['profilePicture']['size'] > 5000000) {
            echo json_encode(['error' => 'File is too large. Maximum size is 5MB.']);
            exit;
        }
        
        if (move_uploaded_file($_FILES['profilePicture']['tmp_name'], $targetFile)) {
            $profile_picture_path = 'uploads/' . $fileName; // Relative path to store in DB
            
            // Delete old profile picture if it's not a placeholder
            if ($current_user['profile_picture'] && 
                !strpos($current_user['profile_picture'], 'placehold.co') && 
                !strpos($current_user['profile_picture'], 'http') &&
                file_exists('../' . $current_user['profile_picture'])) {
                unlink('../' . $current_user['profile_picture']);
            }
        } else {
            echo json_encode(['error' => 'Failed to upload file.']);
            exit;
        }
    } else {
        echo json_encode(['error' => 'Invalid file type. Please upload a valid image (JPG, PNG, GIF, WebP).']);
        exit;
    }
}

// Update username in posts table if username changed
if ($username !== $current_user['username']) {
    $update_posts = $conn->prepare("UPDATE posts SET username = ? WHERE user_id = ?");
    $update_posts->bind_param("si", $username, $current_user_id);
    $update_posts->execute();
    $update_posts->close();
    
    // Update username in comments table
    $update_comments = $conn->prepare("UPDATE comments SET username = ? WHERE user_id = ?");
    $update_comments->bind_param("si", $username, $current_user_id);
    $update_comments->execute();
    $update_comments->close();
    
    // Update username in stories table if it exists
    $check_stories = $conn->query("SHOW TABLES LIKE 'stories'");
    if ($check_stories->num_rows > 0) {
        $update_stories = $conn->prepare("UPDATE stories SET username = ? WHERE user_id = ?");
        $update_stories->bind_param("si", $username, $current_user_id);
        $update_stories->execute();
        $update_stories->close();
    }
    
    // Update username in notifications table
    $update_notifications = $conn->prepare("UPDATE notifications SET from_username = ? WHERE from_user_id = ?");
    $update_notifications->bind_param("si", $username, $current_user_id);
    $update_notifications->execute();
    $update_notifications->close();
}

// --- Update Database ---
$sql = "UPDATE users SET username = ?, firstName = ?, lastName = ?, bio = ?, profile_picture = ? WHERE id = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['error' => 'Failed to prepare statement: ' . $conn->error]);
    exit;
}

$stmt->bind_param("sssssi", $username, $firstName, $lastName, $bio, $profile_picture_path, $current_user_id);

if ($stmt->execute()) {
    // Update session data if username changed
    if ($username !== $current_user['username']) {
        session_start();
        $_SESSION['username'] = $username;
    }
    
    // Return updated profile data including the new profile picture path
    $response = [
        'success' => true, 
        'message' => 'Profile updated successfully.',
        'profile_data' => [
            'username' => $username,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'bio' => $bio,
            'profile_picture' => $profile_picture_path
        ]
    ];
    
    // Include profile picture in response if it was updated
    if ($profile_picture_path !== $current_user['profile_picture']) {
        $response['profile_picture'] = $profile_picture_path;
    }
    
    echo json_encode($response);
} else {
    echo json_encode(['error' => 'Failed to update profile: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>