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

// --- Handle File Upload ---
if (isset($_FILES['profilePicture']) && $_FILES['profilePicture']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../uploads/';
    $fileName = uniqid() . '-' . basename($_FILES['profilePicture']['name']);
    $targetFile = $uploadDir . $fileName;
    
    // Check if it's a valid image
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
    $check = getimagesize($_FILES['profilePicture']['tmp_name']);
    
    if ($check !== false && in_array($imageFileType, ['jpg', 'jpeg', 'png', 'gif'])) {
        if (move_uploaded_file($_FILES['profilePicture']['tmp_name'], $targetFile)) {
            $profile_picture_path = 'uploads/' . $fileName; // Relative path to store in DB
        }
    }
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
    echo json_encode(['success' => true, 'message' => 'Profile updated successfully.']);
} else {
    echo json_encode(['error' => 'Failed to update profile: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>