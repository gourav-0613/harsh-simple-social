<?php
include "config/connect.php";
include "config/auth.php";
requireLogin();

$current_user = getCurrentUser();
// Fallback for missing data
$current_user = array_merge([
    'profile_picture' => 'https://placehold.co/150x150/8897AA/FFFFFF?text=User',
    'username' => 'guest',
    'firstName' => '',
    'lastName' => '',
    'bio' => '',
    'email' => ''
], $current_user);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Profile</title>
    <link rel="stylesheet" href="edit_profile.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet" />
</head>
<body>
    <div class="edit-profile-container">
        <div class="edit-profile-header">
            <button class="back-btn" onclick="window.location.href='profilepage.php'"><i class="fas fa-arrow-left"></i> Back to Profile</button>
            <h2>Edit Your Profile</h2>
        </div>
        <form id="editProfileForm" class="edit-profile-form">
            <div class="form-group profile-pic-upload">
                <label for="profilePicture">Profile Picture:</label>
                <div class="profile-pic-preview" id="profilePicPreview" style="background-image: url('<?php echo htmlspecialchars($current_user['profile_picture']); ?>');"></div>
                <input type="file" id="profilePicture" name="profilePicture" accept="image/*">
                <label for="profilePicture" class="upload-btn">Change Picture</label>
            </div>

            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($current_user['username']); ?>" placeholder="Enter new username">
            </div>

            <div class="form-group">
                <label for="firstName">First Name:</label>
                <input type="text" id="firstName" name="firstName" value="<?php echo htmlspecialchars($current_user['firstName']); ?>" placeholder="Enter your first name">
            </div>
            
            <div class="form-group">
                <label for="lastName">Last Name:</label>
                <input type="text" id="lastName" name="lastName" value="<?php echo htmlspecialchars($current_user['lastName']); ?>" placeholder="Enter your last name">
            </div>

            <div class="form-group">
                <label for="bio">Bio:</label>
                <textarea id="bio" name="bio" placeholder="Tell us about yourself..."><?php echo htmlspecialchars($current_user['bio']); ?></textarea>
            </div>

            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" value="<?php echo htmlspecialchars($current_user['email']); ?>" readonly>
                <small>Email cannot be changed from here.</small>
            </div>

            <button type="submit" class="save-changes-btn">Save Changes</button>
        </form>
    </div>

    <script src="edit_profile.js"></script>
    <script src="dark-mode.js"></script>
</body>
</html>