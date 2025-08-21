<?php
include "config/connect.php";
include "config/auth.php";
requireLogin();

$current_user = getCurrentUser();
$username = $current_user['username'];
$user_id = $current_user['id'];

if (isset($_REQUEST['publish-btn']) && $_REQUEST['publish-btn'] == "true") {
  $target_file = "posts/".basename($_FILES["file-input"]["name"]);
  if (getimagesize($_FILES["file-input"]["tmp_name"]) == false) $file_type = "Video"; else $file_type = "Image";
  if (move_uploaded_file($_FILES["file-input"]["tmp_name"], $target_file)) {
          $caption = mysqli_real_escape_string($conn, $_REQUEST['caption-input']);
          $result = $conn->query("INSERT INTO posts (user_id, username, type, caption, url) VALUES ($user_id, '$username', '$file_type', '$caption', '$target_file')");
          if ($result === TRUE) {
              // Update user's post count
              $conn->query("UPDATE users SET posts_count = posts_count + 1 WHERE id = $user_id");
          }
  } else {
          echo "Sorry, there was an error uploading your file.";
  }
  header("Location: homepage.php");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Social Media Page</title>
  
  <link rel="stylesheet" href="homestyle.css"/>
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
      <button class="nav-btn" id="reels-btn"><i class="fas fa-video"></i><span>Reels</span></button>
      <button class="nav-btn" id="messages-btn"><i class="fas fa-paper-plane"></i><span>Messages</span></button>
    </div>

    <main class="main-content" id="main-content">
      <!-- Stories Section -->
      <div id="stories-container" class="stories-container">
        <div class="story-item add-story" onclick="document.getElementById('story-input').click()">
          <div class="story-avatar">
            <i class="fas fa-plus"></i>
          </div>
          <span>Your Story</span>
          <input type="file" id="story-input" accept="image/*,video/*" style="display: none;">
        </div>
        <!-- Stories will be loaded here -->
      </div>

      <div id="home-page-content"><div id="posts-container"></div></div>

      <div id="post-page-content" class="hidden">
        <span class="close-btn" id="close-post-btn">&times;</span>
        <h1>Create a New Post</h1>

        <div id="media-preview-container"></div>

        <form action = "homepage.php" method = "post" enctype="multipart/form-data">
          <label for = "file-input" class = "file-input-label">Select Image or Video</label>
          <input type = "file" accept = "image/*,video/*" id = "file-input" name = "file-input" class = "hidden">
          <textarea id = "caption-input" name = 'caption-input' placeholder="Write a caption..."></textarea>
          <input type="text" id="location-input" name="location-input" placeholder="Add location..." class="location-input">
          <button type = "submit" class="top-btn" id="publish-btn" name = "publish-btn" value = "true">Publish</button>
        </form>
      </div>
    </main>

    <div class="right-panel">
      <div class="top-buttons">
        <button class="top-btn" id="notifications-btn"><i class="fas fa-heart"></i></button>
        <button class="top-btn" id="logout-btn">Log-out</button>
        <button class="top-btn" id="about-btn">About</button>
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
  
  <div id="about-popup" class="popup-overlay hidden">
    <div class="popup-content"><button class="popup-close-btn" id="about-close-btn">&times;</button>
      <h2>About Us</h2>
      <div style="text-align: left; margin-top: 20px;">
        <p><strong>Website Name:</strong> Simple Social Network</p>
        <p><strong>Version:</strong> 1.0</p>
        <p><strong>Email:</strong> support@simplesocial.com</p>
        <br>
        <p style="text-align: center; font-style: italic;">"Where your voice becomes a vibe"</p>
      </div>
    </div>
  </div>

  <script src="home.js"></script>
  <script src="enhanced_home.js"></script>
  <script src="dark-mode.js"></script>
  <?php
    // Posts are now loaded via JavaScript API calls
  ?>
</body>

</html>