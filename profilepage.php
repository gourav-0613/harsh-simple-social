<?php
include "config/connect.php";
include "config/auth.php";
requireLogin();

$current_user = getCurrentUser();
// Fallback for missing data to prevent errors
$current_user = array_merge([
    'profile_picture' => 'https://placehold.co/180x180/C6AC8F/FFFFFF?text=User',
    'username' => 'guest',
    'followers_count' => 0,
    'following_count' => 0,
    'posts_count' => 0,
    'firstName' => 'New',
    'lastName' => 'User',
    'bio' => 'Welcome to your profile!'
], $current_user);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Profile Page</title>
  <link rel="stylesheet" href="profilepage.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet" />
</head>
<body>
  <div class="sidebar">
    <div class="icon" id="profile-home-btn"><i class="fas fa-home"></i></div>
    <div class="icon" id="profile-settings-btn"><i class="fa-solid fa-gear"></i></div>
    <div class="icon" id="profile-activity-btn"><i class="fas fa-chart-line"></i></div>
  </div>
  
  <div class="profile-container" id="profile-container">
    <div class="profile-header">
      <div class="profile-pic" id="profile-pic" style="background-image: url('<?php echo htmlspecialchars($current_user['profile_picture']); ?>');"></div>
      <div class="profile-info">
        <h1 class="username" id="profile-username"><?php echo htmlspecialchars($current_user['username']); ?></h1>
        <div class="stats">
          <div class="posts-stat"><strong id="posts-count"><?php echo htmlspecialchars($current_user['posts_count'] ?? 0); ?></strong><br>posts</div>
          <div><strong><?php echo htmlspecialchars($current_user['followers_count']); ?></strong><br>followers</div>
          <div><strong><?php echo htmlspecialchars($current_user['following_count']); ?></strong><br>following</div>
        </div>
        <div class="bio">
          <p><strong id="profile-fullname"><?php echo htmlspecialchars($current_user['firstName'] . ' ' . $current_user['lastName']); ?></strong><br><span id="profile-bio"><?php echo htmlspecialchars($current_user['bio']); ?></span></p>
        </div>
        <div class="buttons">
          <button id="edit-profile-btn">Edit Profile</button>
          <button id="view-archive-btn">View Archive</button>
        </div>
      </div>
    </div>

    <div class="center-icon"><i class="fas fa-image"></i></div>

    <div class="post-grid" id="user-posts-container">
      <p class="no-posts-message">No posts yet. Go to home to create one!</p>
    </div>
  </div>

  <div class="popup-overlay hidden" id="settings-popup">
    <div class="popup-content settings-popup-content">
      <button class="popup-close-btn" id="settings-close-btn">&times;</button>
      <h2>Settings</h2>
      <ul>
        <li class="settings-toggle-item">
          <span>Dark Mode</span>
          <label class="switch">
            <input type="checkbox" id="darkModeToggle">
            <span class="slider round"></span>
          </label>
        </li>
        <li id="settings-qrcode-btn">QR Code</li>
        <li id="settings-privacy-btn">Privacy</li>
        <li id="settings-logout-btn">Log Out</li>
        <li id="settings-cancel-btn">Cancel</li>
      </ul>
    </div>
  </div>

  <div class="popup-overlay hidden" id="privacy-popup">
    <div class="popup-content settings-popup-content">
      <button class="popup-close-btn" id="privacy-close-btn">&times;</button>
      <h2>Privacy Settings</h2>
      <div class="privacy-settings">
        <div class="privacy-option">
          <div class="privacy-option-info">
            <div class="privacy-option-title">Private Account</div>
            <div class="privacy-option-desc">When your account is private, only people you approve can see your photos and videos on Nexus. Your existing followers won't be affected.</div>
          </div>
          <label class="switch">
            <input type="checkbox" id="privateAccountToggle">
            <span class="slider round"></span>
          </label>
        </div>
      </div>
      <div style="padding: 20px 25px;">
        <button class="popup-btn cancel" id="privacy-cancel-btn">Done</button>
      </div>
    </div>
  </div>

  <div class="popup-overlay hidden" id="underConstructionModal">
    <div class="popup-content under-construction-content">
      <h2>Coming Soon!</h2>
      <p>This feature is currently under construction. Please check back later!</p>
      <button class="popup-btn confirm" id="under-construction-ok-btn">OK</button>
    </div>
  </div>

  <div class="popup-overlay hidden" id="logout-confirm-popup">
    <div class="logout-confirm-content">
      <h2>Log Out</h2>
      <p>Are you sure you want to log out?</p>
      <div class="logout-confirm-buttons">
        <button class="logout-btn-confirm" id="confirm-logout-btn">Log Out</button>
        <button class="logout-btn-cancel" id="cancel-logout-btn">Cancel</button>
      </div>
    </div>
  </div>

  <script src="profile.js"></script>
  <script src="dark-mode.js"></script>
  <script src="nexus-popups.js"></script>
</body>
</html>