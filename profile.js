document.addEventListener('DOMContentLoaded', function() {
    const profileContainer = document.getElementById('profile-container');
    const profilePic = document.getElementById('profile-pic');
    const profileUsername = document.getElementById('profile-username');
    const profileFullname = document.getElementById('profile-fullname');
    const profileBio = document.getElementById('profile-bio');

    const profileHomeBtn = document.getElementById('profile-home-btn');
    const profileSettingsBtn = document.getElementById('profile-settings-btn');
    const profileActivityBtn = document.getElementById('profile-activity-btn'); // New: Your Activity Button
    const editProfileBtn = document.getElementById('edit-profile-btn');

    const settingsPopup = document.getElementById('settings-popup');
    const settingsCloseBtn = document.getElementById('settings-close-btn');
    const settingsQrcodeBtn = document.getElementById('settings-qrcode-btn');
    const settingsPrivacyBtn = document.getElementById('settings-privacy-btn');
    const settingsLogoutBtn = document.getElementById('settings-logout-btn');
    const settingsCancelBtn = document.getElementById('settings-cancel-btn');
    const darkModeToggle = document.getElementById('darkModeToggle');

    const underConstructionModal = document.getElementById('underConstructionModal');
    const underConstructionOkBtn = document.getElementById('under-construction-ok-btn');

    const logoutConfirmPopup = document.getElementById('logout-confirm-popup');
    const confirmLogoutBtn = document.getElementById('confirm-logout-btn');
    const cancelLogoutBtn = document.getElementById('cancel-logout-btn');

    // --- Helper function for blur animation ---
    function toggleBlur(addBlur) {
        if (addBlur) {
            profileContainer.classList.add('blur-it');
        } else {
            profileContainer.classList.remove('blur-it');
        }
    }

    // --- Dynamic Profile Data (Placeholder) ---
    let userData = {
        username: 'JohnDoe',
        profilePicUrl: 'https://placehold.co/180x180/8897AA/FFFFFF?text=JD',
        fullName: 'Johnathan Doe',
        bio: 'Passionate about web development and open source projects.'
    };

    function updateProfileUI() {
        profileUsername.textContent = userData.username;
        profilePic.style.backgroundImage = `url('${userData.profilePicUrl}')`;
        profileFullname.textContent = userData.fullName;
        profileBio.textContent = userData.bio;
    }

    // Initial UI update
    updateProfileUI();

    // --- Dark Mode Initialization and Toggle ---
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.documentElement.classList.add('dark-mode');
        darkModeToggle.checked = true;
    } else {
        document.documentElement.classList.remove('dark-mode');
        darkModeToggle.checked = false;
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                document.documentElement.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }

    // --- Home Button Functionality with Animation ---
    if (profileHomeBtn) {
        profileHomeBtn.addEventListener('click', function(event) {
            event.preventDefault();
            toggleBlur(true);
            setTimeout(() => {
                window.location.href = 'homepage.php';
            }, 300);
        });
    }

    // --- Settings Icon Functionality ---
    if (profileSettingsBtn) {
        profileSettingsBtn.addEventListener('click', function() {
            settingsPopup.classList.remove('hidden');
            toggleBlur(true);
        });
    }

    if (settingsCloseBtn) {
        settingsCloseBtn.addEventListener('click', function() {
            settingsPopup.classList.add('hidden');
            toggleBlur(false);
        });
    }

    // --- Your Activity Button Functionality ---
    if (profileActivityBtn) {
        profileActivityBtn.addEventListener('click', function() {
            underConstructionModal.classList.remove('hidden'); // Show under construction modal
            toggleBlur(true); // Apply blur
        });
    }

    // Handle clicks on settings list items
    if (settingsQrcodeBtn) {
        settingsQrcodeBtn.addEventListener('click', function() {
            settingsPopup.classList.add('hidden');
            underConstructionModal.classList.remove('hidden');
        });
    }

    if (settingsPrivacyBtn) {
        settingsPrivacyBtn.addEventListener('click', function() {
            settingsPopup.classList.add('hidden');
            underConstructionModal.classList.remove('hidden');
        });
    }

    if (settingsLogoutBtn) {
        settingsLogoutBtn.addEventListener('click', function() {
            settingsPopup.classList.add('hidden');
            logoutConfirmPopup.classList.remove('hidden');
        });
    }

     if (settingsCancelBtn) {
        settingsCancelBtn.addEventListener('click', function() {
            settingsPopup.classList.add('hidden');
            toggleBlur(false);
        });
    }

    // --- Under Construction Modal Functionality ---
    if (underConstructionOkBtn) {
        underConstructionOkBtn.addEventListener('click', function() {
            underConstructionModal.classList.add('hidden');
            toggleBlur(false);
        });
    }

    // --- Logout Confirmation Functionality ---
    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', function() {
            toggleBlur(true);
            setTimeout(() => {
                window.location.href = 'logout.php';
            }, 300);
        });
    }

    if (cancelLogoutBtn) {
        cancelLogoutBtn.addEventListener('click', function() {
            logoutConfirmPopup.classList.add('hidden');
            toggleBlur(false);
        });
    }

    // --- Edit Profile Button Redirection ---
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            toggleBlur(true);
            setTimeout(() => {
                window.location.href = 'edit_profile.php';
            }, 300);
        });
    }

    // --- Close popups when clicking outside ---
    window.addEventListener('click', function(event) {
        if (event.target === settingsPopup) {
            settingsPopup.classList.add('hidden');
            toggleBlur(false);
        }
        if (event.target === underConstructionModal) {
            underConstructionModal.classList.add('hidden');
            toggleBlur(false);
        }
        if (event.target === logoutConfirmPopup) {
            logoutConfirmPopup.classList.add('hidden');
            toggleBlur(false);
        }
    });
});
