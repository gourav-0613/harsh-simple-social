<?php
include "config/connect.php";
session_start();
if (!isset($_SESSION['email'])) {
    header("Location: index.php");
    exit();
}

$username = "dummy_user";

if (isset($_REQUEST['publish-btn']) && $_REQUEST['publish-btn'] == "true") {
  $target_file = "posts/".basename($_FILES["file-input"]["name"]);
  if (getimagesize($_FILES["file-input"]["tmp_name"]) == false) $file_type = "Video"; else $file_type = "Image";
  if (move_uploaded_file($_FILES["file-input"]["tmp_name"], $target_file)) {
          $result = $conn->query("insert into posts (username, type, description, url) values (\"$username\", \"$file_type\", \"".$_REQUEST['caption-input']."\", \"$target_file\");");
          if ($result === TRUE) {
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
    </div>

    <main class="main-content" id="main-content">
      <div id="home-page-content"><div id="posts-container"></div></div>

      <div id="post-page-content" class="hidden">
        <span class="close-btn" id="close-post-btn">&times;</span>
        <h1>Create a New Post</h1>

        <div id="media-preview-container"></div>

        <form action = "homepage.php" method = "post" enctype="multipart/form-data">
          <label for = "file-input" class = "file-input-label">Select Image or Video</label>
          <input type = "file" accept = "image/*,video/*" id = "file-input" name = "file-input" class = "hidden">
          <textarea id = "caption-input" name = 'caption-input' placeholder="Write a caption..."></textarea>
          <button type = "submit" class="top-btn" id="publish-btn" name = "publish-btn" value = "true">Publish</button>
        </form>
      </div>
    </main>

    <div class="right-panel">
      <div class="top-buttons">
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
  <script src="dark-mode.js"></script>
  <?php
    function addPost($description, $url, $username) { ?>
      <script>
        document.getElementById("main-content").innerHTML += "<div class = \"post\"><img src = \"<?php echo $url; ?>\" width = 100%><p><?php echo $description; ?></p><p style = \"text-align: right-panel\"><?php echo $username; ?></p></div>"
      </script>
    <?php }
    function addVideoPost($description, $url, $username) { ?>
      <script>
        document.getElementById("main-content").innerHTML += "<div class = \"post\"><video width = 100% controls><source src = \"<?php echo $url; ?>\"></video><p><?php echo $description; ?></p><p style = \"text-align: right-panel\"><?php echo $username; ?></p></div>"
      </script>
    <?php }
    function loadPost() {
      global $conn;
      $result = $conn->query("select username, type, description, url from posts order by id desc limit 25;");
      if ($result->num_rows == 0) { ?>
        <script>
          document.getElementById("main-content").innerHTML = "<p class=\"no-posts-message\">No posts yet. Why not create one?</p>";
        </script>
      <?php }
      while ($row = $result->fetch_assoc()) {
        if ($row['type'] == "Image") addPost($row['description'], $row['url'], $row['username']);
        else addVideoPost($row['description'], $row['url'], $row['username']);
      }
    }
    loadPost();
  ?>
</body>

</html>