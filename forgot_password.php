<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Forgot Password - Nexus</title>
  <link rel="stylesheet" href="styles.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</head>
<body>
  <div class="top-links">
    <a href="index.php">Back to Sign In</a>
  </div>

  <div class="main-container">
    <div class="left-section">
      <div class="intro-section">
        <h1>Nexus</h1>
        <p class="tagline">Reset Your Password</p>
      </div>
      <div class="empty-box"></div>
    </div>

    <div class="right-section">
      <div class="auth-forms-wrapper">
        <!-- Email Verification Form -->
        <div class="auth-box visible" id="email-verification">
          <h1 class="form-title">Forgot Password</h1>
          <p style="text-align: center; color: var(--subtle-accent); margin-bottom: 20px;">
            Enter your email address to verify your account
          </p>
          <form id="email-verification-form">
            <div class="input-group">
                <i class="fas fa-envelope"></i>
                <input type="email" id="verification-email" placeholder="Enter your email" required>
                <label for="verification-email">Email Address</label>
            </div>
            <button type="submit" class="btn">Verify Email</button>
          </form>
          <div class="links">
            <p>Remember your password?</p>
            <a href="index.php" style="color: var(--accent-highlight); text-decoration: none;">Back to Sign In</a>
          </div>
        </div>

        <!-- Password Reset Form -->
        <div class="auth-box hidden" id="password-reset">
          <h1 class="form-title">Reset Password</h1>
          <p style="text-align: center; color: var(--subtle-accent); margin-bottom: 20px;">
            Create a new password for your account
          </p>
          <form id="password-reset-form">
            <div class="input-group">
                <i class="fas fa-lock"></i>
                <input type="password" id="new-password" placeholder="New Password" required>
                <label for="new-password">New Password</label>
            </div>
            <div class="input-group">
                <i class="fas fa-lock"></i>
                <input type="password" id="confirm-password" placeholder="Confirm Password" required>
                <label for="confirm-password">Confirm Password</label>
            </div>
            <button type="submit" class="btn">Reset Password</button>
          </form>
          <div class="links">
            <a href="index.php" style="color: var(--accent-highlight); text-decoration: none;">Back to Sign In</a>
          </div>
        </div>
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

  <script src="forgot_password.js"></script>
  <script src="dark-mode.js"></script>
  <script src="nexus-popups.js"></script>
</body>
</html>