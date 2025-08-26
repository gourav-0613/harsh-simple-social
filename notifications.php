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
  <title>Notifications - Social Media</title>
  
  <link rel="stylesheet" href="homestyle.css"/>
  <link rel="stylesheet" href="notifications.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet" />
</head>
<body>
  <div class="container" id="main-container">
    <div class="sidebar">
      <button class="nav-btn" id="profile-btn"><i class="fas fa-user"></i><span>Profile</span></button>
      <button class="nav-btn" id="home-btn"><i class="fas fa-home"></i><span>Home</span></button>
      <button class="nav-btn" id="add-btn"><i class="fas fa-plus-circle"></i><span>Add</span></button>
      <button class="nav-btn" id="explore-btn"><i class="fas fa-compass"></i><span>Explore</span></button>
      <button class="nav-btn" id="messages-btn" onclick="event.preventDefault();"><i class="fas fa-paper-plane"></i><span>Messages</span></button>
    </div>

    <main class="main-content">
      <div class="notifications-header">
        <h1>Notifications</h1>
        <div class="notifications-actions">
          <button class="mark-all-read-btn" id="mark-all-read">Mark all as read</button>
          <button class="follow-requests-btn" id="follow-requests-btn">Follow Requests</button>
        </div>
      </div>

      <div class="notifications-container" id="notifications-container">
        <!-- Notifications will be loaded here -->
      </div>
      
      <div class="follow-requests-container hidden" id="follow-requests-container">
        <div class="follow-requests-header">
          <button class="back-to-notifications-btn" id="back-to-notifications-btn">
            <i class="fas fa-arrow-left"></i> Back to Notifications
          </button>
          <h2>Follow Requests</h2>
        </div>
        <div id="follow-requests-list">
          <!-- Follow requests will be loaded here -->
        </div>
      </div>
    </main>

    <div class="right-panel">
      <div class="top-buttons">
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

  <script src="notifications.js"></script>
  <script src="dark-mode.js"></script>
  <script src="nexus-popups.js"></script>
  <script src="global_interactions.js"></script> 
</body>
</html>