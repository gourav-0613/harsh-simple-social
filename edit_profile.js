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

        // Show loading popup
        if (typeof showLoadingPopup === 'function') {
            showLoadingPopup('Updating Profile', 'Please wait while we update your profile...');
        }

        // Create FormData object
        const formData = new FormData();
        formData.append('username', userIdInput.value);
        formData.append('firstName', fullNameInput.value);
        formData.append('lastName', lastNameInput.value);
        formData.append('bio', bioTextarea.value);
        
        // Add profile picture if changed
        if (profilePictureInput.files[0]) {
            formData.append('profilePicture', profilePictureInput.files[0]);
        }

        // Submit to server
        fetch('api/update_profile.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (typeof hidePopup === 'function') {
                hidePopup();
            }
            
            if (data.success) {
                if (typeof showSuccessPopup === 'function') {
                    showSuccessPopup('Profile Updated Successfully!', 'Your profile changes have been saved.');
                    setTimeout(() => {
                        window.location.href = 'profilepage.php';
                    }, 2000);
                } else {
                    if (typeof showSuccessPopup === 'function') {
                        showSuccessPopup('Profile Updated!', 'Your profile has been updated successfully.');
                    }
                    window.location.href = 'profilepage.php';
                }
            } else {
                if (typeof showErrorPopup === 'function') {
                    showErrorPopup('Update Failed', data.error || 'Could not update profile');
                } else {
                    if (typeof showErrorPopup === 'function') {
                        showErrorPopup('Error', data.error || 'Could not update profile');
                    }
                }
            }
        })
        .catch(error => {
            if (typeof hidePopup === 'function') {
                hidePopup();
            }
            console.error('Error updating profile:', error);
            if (typeof showErrorPopup === 'function') {
                showErrorPopup('Error', 'An error occurred while updating your profile');
            } else {
                if (typeof showErrorPopup === 'function') {
                    showErrorPopup('Error', 'An error occurred while updating your profile');
                }
            }
        });
    });
});
