<?php
include "config/connect.php";
include "config/auth.php";

$username = $_GET['user'] ?? '';
if (empty($username)) {
    header("Location: homepage.php");
    exit;
}

$current_user = getCurrentUser();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title><?php echo htmlspecialchars($username); ?> - Nexus</title>
  <link rel="stylesheet" href="public_profile.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</head>
<body>
  <div class="sidebar">
    <div class="icon" id="back-btn"><i class="fas fa-arrow-left"></i></div>
    <div class="icon" id="home-btn"><i class="fas fa-home"></i></div>
    <div class="icon" id="explore-btn"><i class="fas fa-compass"></i></div>
  </div>
  
  <div class="profile-container" id="profile-container">
    <div class="profile-header" id="profile-header">
      <!-- Profile data will be loaded here -->
    </div>

    <div class="center-icon"><i class="fas fa-image"></i></div>

    <div class="post-grid" id="user-posts-container">
      <p class="no-posts-message">Loading posts...</p>
    </div>
  </div>

  <!-- Follow Confirmation Popup -->
  <div class="popup-overlay hidden" id="follow-popup">
    <div class="popup-content">
      <h2 id="follow-popup-title">Follow User</h2>
      <p id="follow-popup-message">Are you sure you want to follow this user?</p>
      <div class="popup-buttons">
        <button class="popup-btn confirm" id="follow-confirm-btn">Follow</button>
        <button class="popup-btn cancel" id="follow-cancel-btn">Cancel</button>
      </div>
    </div>
  </div>

  <!-- Custom Nexus Popups -->
  <div id="nexus-popup-overlay" class="nexus-popup-overlay">
    <div id="nexus-popup" class="nexus-popup">
      <div id="nexus-popup-content">
        <h3 id="nexus-popup-title">Success</h3>
        <p id="nexus-popup-message">Operation completed successfully!</p>
        <button id="nexus-popup-btn" class="nexus-popup-btn">OK</button>
      </div>
    </div>
  </div>

  <script src="public_profile.js"></script>
  <script src="dark-mode.js"></script>
  <script src="nexus-popups.js"></script>
</body>
</html>