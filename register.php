<?php 

include ('config/connect.php');
include ('config/auth.php');

// sign up
if(isset($_POST['signUp'])){
    $firstName=$_POST['fName'];
    $lastName=$_POST['lName'];
    $username=$_POST['username'];
    $email=$_POST['email'];
    $password=$_POST['password'];
    $password=md5($password);

     $checkEmail="SELECT * From users where email='$email' OR username='$username'";
     $result=$conn->query($checkEmail);
     if($result->num_rows>0){
        $signup_error = "Email or Username already exists!";
     }
     else{
        $insertQuery="INSERT INTO users(firstName,lastName,username,email,password)
                       VALUES ('$firstName','$lastName','$username','$email','$password')";
            if($conn->query($insertQuery)==TRUE){
                // Update posts_count to 0 for new users
                $conn->query("UPDATE users SET posts_count = 0 WHERE email = '$email'");
                $signup_success = true;
            }
            else{
                $signup_error = "There was an error creating your account. Please try again.";
            }
     }
}


//sign in 
if(isset($_POST['signIn'])){
   $email=$_POST['email'];
   $password=$_POST['password'];
   $password=md5($password) ;
   
   $sql="SELECT * FROM users WHERE (email='$email' OR username='$email') and password='$password'";
   $result=$conn->query($sql);
   if($result->num_rows>0){
    session_start();
    $row=$result->fetch_assoc();
    $_SESSION['user_id']=$row['id'];
    $_SESSION['username']=$row['username'];
    $_SESSION['email']=$row['email'];
    $login_success = true;
   }
   else{
    $login_error = "Incorrect email/username or password.";
   }

}
?>

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
    <a href="index.php">Back to Login</a>
  </div>

  <div class="main-container">
    <div class="left-section">
      <div class="intro-section">
        <h1>Nexus</h1>
        <p class="tagline">Connect. Share. Inspire.</p>
      </div>
      <div class="empty-box"></div>
    </div>

    <div class="right-section">
      <div class="auth-forms-wrapper">
        <!-- Processing message -->
        <div class="auth-box visible">
          <h1 class="form-title">Processing...</h1>
          <p style="text-align: center; color: var(--subtle-accent); margin-bottom: 20px;">
            Please wait while we process your request.
          </p>
          <div class="loading-spinner"></div>
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
  
  <script src="nexus-popups.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      <?php if (isset($login_success) && $login_success): ?>
        showSuccessPopup('Login Successful!', 'Welcome back to Nexus!');
        setTimeout(() => {
          window.location.href = 'homepage.php';
        }, 2000);
      <?php elseif (isset($login_error)): ?>
        showErrorPopup('Login Failed', '<?php echo addslashes($login_error); ?>');
        setTimeout(() => {
          window.location.href = 'index.php';
        }, 3000);
      <?php elseif (isset($signup_success) && $signup_success): ?>
        showSuccessPopup('Account Created Successfully!', 'Welcome to Nexus! Your account has been created.');
        setTimeout(() => {
          window.location.href = 'index.php';
        }, 2000);
      <?php elseif (isset($signup_error)): ?>
        showErrorPopup('Registration Failed', '<?php echo addslashes($signup_error); ?>');
        setTimeout(() => {
          window.location.href = 'index.php';
        }, 3000);
      <?php else: ?>
        // No action needed, redirect back to index
        window.location.href = 'index.php';
      <?php endif; ?>
    });
  </script>
</body>
</html>