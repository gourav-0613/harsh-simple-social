<?php
include '../config/connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'verify_email') {
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        
        $result = $conn->query("SELECT id FROM users WHERE email = '$email'");
        
        if ($result->num_rows > 0) {
            // Store email in session for password reset
            session_start();
            $_SESSION['reset_email'] = $email;
            echo json_encode(['success' => true, 'message' => 'Email verified successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Email not found in our records']);
        }
    }
    
    if ($action === 'reset_password') {
        session_start();
        
        if (!isset($_SESSION['reset_email'])) {
            echo json_encode(['success' => false, 'message' => 'Session expired. Please verify email again.']);
            exit;
        }
        
        $email = $_SESSION['reset_email'];
        $new_password = $_POST['new_password'];
        $confirm_password = $_POST['confirm_password'];
        
        if ($new_password !== $confirm_password) {
            echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
            exit;
        }
        
        if (strlen($new_password) < 6) {
            echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long']);
            exit;
        }
        
        $hashed_password = md5($new_password);
        $conn->query("UPDATE users SET password = '$hashed_password' WHERE email = '$email'");
        
        // Clear session
        unset($_SESSION['reset_email']);
        
        echo json_encode(['success' => true, 'message' => 'Password reset successfully']);
    }
}
?>