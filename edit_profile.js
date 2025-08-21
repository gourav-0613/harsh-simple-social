document.addEventListener('DOMContentLoaded', function() {
    const profilePictureInput = document.getElementById('profilePicture');
    const profilePicPreview = document.getElementById('profilePicPreview');
    const editProfileForm = document.getElementById('editProfileForm');
    const userIdInput = document.getElementById('userId');
    const fullNameInput = document.getElementById('fullName');
    const bioTextarea = document.getElementById('bio');
    const genderSelect = document.getElementById('gender');
    const emailInput = document.getElementById('email');

    // --- Load existing data (placeholder) ---
    let currentProfileData = {
        userId: 'JohnDoe',
        profilePicUrl: 'https://placehold.co/150x150/8897AA/FFFFFF?text=JD', // Example placeholder image
        fullName: 'Johnathan Doe',
        bio: 'Passionate about web development and open source projects.',
        gender: 'male', // Default or fetched value
        email: 'johndoe@example.com'
    };

    function loadProfileData() {
        userIdInput.value = currentProfileData.userId;
        profilePicPreview.style.backgroundImage = `url('${currentProfileData.profilePicUrl}')`;
        fullNameInput.value = currentProfileData.fullName;
        bioTextarea.value = currentProfileData.bio;
        genderSelect.value = currentProfileData.gender;
        emailInput.value = currentProfileData.email;
    }

    loadProfileData(); // Load data when the page loads

    // --- Profile Picture Preview ---
    profilePictureInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePicPreview.style.backgroundImage = `url('${e.target.result}')`;
                currentProfileData.profilePicUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // --- Form Submission (Placeholder) ---
    editProfileForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Update currentProfileData with form values
        currentProfileData.userId = userIdInput.value;
        currentProfileData.fullName = fullNameInput.value;
        currentProfileData.bio = bioTextarea.value;
        currentProfileData.gender = genderSelect.value;

        console.log("Saving profile data:", currentProfileData);

        alert("Profile updated successfully!"); // Using alert for simplicity, consider custom modal
        window.location.href = 'profilepage.php';
    });
});
