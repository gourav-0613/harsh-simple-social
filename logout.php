<?php
session_start();
session_unset();
session_destroy();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Logging Out - Nexus</title>
  <link rel="stylesheet" href="styles.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</head>
<body>
  <!-- Custom Nexus Popups -->
  <div id="nexus-popup-overlay" class="nexus-popup-overlay show">
    <div id="nexus-popup" class="nexus-popup success">
      <div id="nexus-popup-content">
        <h3>Logged Out Successfully!</h3>
        <p>Thank you for using Nexus. You have been logged out safely.</p>
        <div class="loading-spinner"></div>
      </div>
    </div>
  </div>
  
  <script src="nexus-popups.js"></script>
  <script>
    // Auto redirect after showing success message
    setTimeout(() => {
      window.location.href = 'index.php';
    }, 2000);
  </script>
</body>
</html>
