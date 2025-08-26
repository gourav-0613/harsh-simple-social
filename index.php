<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nexus - Connect & Share</title>
  <link rel="stylesheet" href="styles.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</head>

<body>

  <div class="top-links">
    <a href="#" id="helpBtn">Help</a> | <a href="#" id="contactBtn">Contact Us</a>
  </div>

  <!-- Main container for the two-column layout -->
  <div class="main-container">
    <!-- Left column for intro text and empty box -->
    <div class="left-section">
      <div class="intro-section">
        <h1>Nexus</h1>
        <p class="tagline">Where your Voice become a Vibe</p>
      </div>
      <!-- This is the new empty container for spacing -->
      <div class="empty-box"></div>
       <video class="promo-video" width="100%" controls>
          <source src="https://media.istockphoto.com/id/2171109849/video/viral-video-social-media-image-based-social-media-generation-z-like-button-tutorial-dancing.mp4?s=mp4-640x640-is&k=20&c=08f1G_7rcyWwHB2cTy2YdXudlMcq1CuVpPDPSR9_T2o=" type="video/mp4">
          Your browser does not support the video tag.
        </video>
    </div>

    <!-- Right column for the authentication forms -->
    <div class="right-section">
      <div class="auth-forms-wrapper">
        <!-- Sign In Form -->
        <div class="auth-box visible" id="signIn">
          <h1 class="form-title">Sign In</h1>
          <form method="post" action="register.php">
            <div class="input-group">
                <i class="fas fa-envelope"></i>
                <input type="email" name="email" id="email" placeholder="Email" required>
                <label for="email">Email</label>
            </div>
            <div class="input-group">
                <i class="fas fa-lock"></i>
                <input type="password" name="password" id="password" placeholder="Password" required>
                <label for="password">Password</label>
            </div>
            <p class="recover">
              <a href="forgot_password.php">Forgot Password</a>
            </p>
           <input type="submit" class="btn" value="Sign In" name="signIn">
          </form>
          <p class="or">
            ------OR------
          </p>
          <div class="icons">
<a href="https://www.google.com" class="social-icon" title="Sign in with Google" target="_blank" onclick="alert('Google link clicked!');">
              <i class="fab fa-google"></i>
            </a>
<a href="https://www.facebook.com" class="social-icon" title="Sign in with Facebook" target="_blank">
              <i class="fab fa-facebook"></i>
            </a>
          </div>
          <div class="links">
            <p>Don't have any account yet?</p>
            <button id="signUpButton">Sign Up</button>
          </div>
        </div>

        <!-- Registration Form -->
        <div class="auth-box hidden" id="signup">
          <h1 class="form-title">Register</h1>
          <form method="post" action="register.php">
            <div class="input-group">
               <i class="fas fa-at"></i>
               <input type="text" name="username" id="username" placeholder="Username" required>
               <label for="username">Username</label>
            </div>
            <div class="input-group">
               <i class="fas fa-user"></i>
               <input type="text" name="fName" id="fName" placeholder="First Name" required>
               <label for="fname">First Name</label>
            </div>
            <div class="input-group">
                <i class="fas fa-user"></i>
                <input type="text" name="lName" id="lName" placeholder="Last Name" required>
                <label for="lName">Last Name</label>
            </div>
            <div class="input-group">
                <i class="fas fa-envelope"></i>
                <input type="email" name="email" id="email-signup" placeholder="Email" required>
                <label for="email-signup">Email</label>
            </div>
            <div class="input-group">
                <i class="fas fa-lock"></i>
                <input type="password" name="password" id="password-signup" placeholder="Password" required>
                <label for="password-signup">Password</label>
            </div>
           <input type="submit" class="btn" value="Sign Up" name="signUp">
          </form>
          <p class="or">
            ------OR------
          </p>
<div class="icons">
            <a href="https://www.google.com" class="social-icon" title="Sign up with Google">
              <i class="fab fa-google"></i>
            </a>
<a href="https://www.facebook.com" class="social-icon" title="Sign up with Facebook">
              <i class="fab fa-facebook"></i>
            </a>
          </div>
          <div class="links">
            <p>Already Have Account ?</p>
            <button id="signInButton">Sign In</button>
          </div>
        </div>
      </div>
    </div>
  </div>



  <!-- Help Modal -->
  <div id="helpModal" class="modal">
    <div class="modal-content">
      <span class="close-btn" id="closeHelp">&times;</span>
      <h2>Help Center</h2>
      <p>Welcome to the Help Center of Nexus.</p>
      <p>If you're having trouble logging in, make sure:</p>
      <ul>
        <li>Your <strong>username</strong> is correct</li>
        <li>Your <strong>password</strong> is case-sensitive</li>
        <li>Please check your internet connection </li>
      </ul>
      <form action = "helpQuerySubmit.php" method = "post">
        <div class="help-form-group">
          <p>If you have any other query type Here:</p>
          <input type="text" id="helpQuery" name = "helpQuery" placeholder="Type your query...">
        </div>
        <div class="help-form-group">
          <p>Please Enter Your Email to Contact you:</p>
          <input type="email" id="helpEmail" name = "helpEmail" placeholder="Enter your email...">
        </div>
        <button type = "submit" class="help-submit-btn" name = "submitQueryButton" value = "true" id="submitQueryButton">Submit</button>
      </form>
    </div>
  </div>

  <!-- Submission Success Modal -->
  <div id="submissionSuccessModal" class="modal">
    <div class="modal-content">
      <h2>Query Submitted!</h2>
      <p>Your query has been successfully submitted. We will get back to you shortly!</p>
      <button class="help-submit-btn" id="okButton">OK</button>
    </div>
  </div>

   <!-- Contact us model -->
  <div id="contactModal" class="modal">
    <div class="modal-content">
      <span class="close-btn" id="contactclose-btn">&times;</span>
      <h2>Contact Information</h2>
      <p><strong>Email:</strong> support@nexus.com</p>
      <p><strong>Telephone:</strong> +91-XXX-XXXXXXX</p>
      <p><strong>Mobile:</strong> +91-XXXXXXXXXX</p>
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
  
  <script src="script.js"></script>
  <script src="dark-mode.js"></script>
  <script src="nexus-popups.js"></script>
</body>

</html>
