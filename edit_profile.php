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
                <div class="profile-pic-preview" id="profilePicPreview" style="background-image: url('https://placehold.co/150x150/8897AA/FFFFFF?text=Upload');"></div>
                <input type="file" id="profilePicture" accept="image/*">
                <label for="profilePicture" class="upload-btn">Change Picture</label>
            </div>

            <div class="form-group">
                <label for="userId">User ID:</label>
                <input type="text" id="userId" value="JohnDoe" placeholder="Enter new User ID">
            </div>

            <div class="form-group">
                <label for="fullName">Full Name:</label>
                <input type="text" id="fullName" value="Johnathan Doe" placeholder="Enter your full name">
            </div>

            <div class="form-group">
                <label for="bio">Bio:</label>
                <textarea id="bio" placeholder="Tell us about yourself...">Passionate about web development and open source projects.</textarea>
            </div>

            <div class="form-group">
                <label for="gender">Gender:</label>
                <select id="gender">
                    <option value="not-specified">Not Specified</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" value="johndoe@example.com" readonly>
                <small>Email cannot be changed from here.</small>
            </div>

            <button type="submit" class="save-changes-btn">Save Changes</button>
        </form>
    </div>

    <script src="edit_profile.js"></script>
    <script src="dark-mode.js"></script>
</body>
</html>
