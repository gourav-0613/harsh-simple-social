<?php
include "config/connect.php";
include "config/auth.php";
requireLogin();

$current_user = getCurrentUser();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Activity - Nexus</title>
  <link rel="stylesheet" href="homestyle.css"/>
  <link rel="stylesheet" href="activity_page.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</head>
<body>
  <div class="container" id="main-container">
    <div class="sidebar">
      <button class="nav-btn" id="profile-btn"><i class="fas fa-user"></i><span>Profile</span></button>
      <button class="nav-btn" id="home-btn"><i class="fas fa-home"></i><span>Home</span></button>
      <button class="nav-btn" id="add-btn"><i class="fas fa-plus-circle"></i><span>Add</span></button>
      <button class="nav-btn" id="explore-btn"><i class="fas fa-compass"></i><span>Explore</span></button>
      <button class="nav-btn" id="messages-btn"><i class="fas fa-paper-plane"></i><span>Messages</span></button>
    </div>

    <main class="main-content">
      <div class="activity-header">
        <h1>Your Activity</h1>
        <p>Posts you've liked</p>
      </div>

      <div id="activity-posts-container" class="activity-posts">
        <!-- Liked posts will be loaded here -->
      </div>
    </main>

    <div class="right-panel">
      <div class="top-buttons">
        <button class="top-btn" id="notifications-btn"><i class="fas fa-heart"></i></button>
        <button class="top-btn" id="logout-btn">Log-out</button>
      </div>
    </div>
  </div>

  <!-- Popups -->
  <div id="logout-popup" class="popup-overlay hidden">
    <div class="popup-content">
      <h2>Log Out</h2>
      <p>Are you sure you want to log out?</p>
       <div class="popup-buttons">
        <button class="popup-btn confirm" id="logout-confirm-btn">Log Out</button>
        <button class="popup-btn cancel" id="logout-cancel-btn">Cancel</button>
      </div>
    </div>
  </div>

  <script src="activity_page.js"></script>
  <script src="dark-mode.js"></script>
</body>
</html>