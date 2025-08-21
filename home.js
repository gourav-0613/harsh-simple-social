// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all the buttons by their IDs
    const profileBtn = document.getElementById('profile-btn');
    const homeBtn = document.getElementById('home-btn');
    const addBtn = document.getElementById('add-btn');
    const publishBtn = document.getElementById('publish-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const aboutBtn = document.getElementById('about-btn');
    const logoutConfirmBtn = document.getElementById('logout-confirm-btn');
    const logoutCancelBtn = document.getElementById('logout-cancel-btn');
    const aboutCloseBtn = document.getElementById('about-close-btn');
    const closePostBtn = document.getElementById('close-post-btn');
    
    // Get other elements
    const homePageContent = document.getElementById('home-page-content');
    const postPageContent = document.getElementById('post-page-content');
    const logoutPopup = document.getElementById('logout-popup');
    const aboutPopup = document.getElementById('about-popup');
    const fileInput = document.getElementById('file-input');
    const mediaPreviewContainer = document.getElementById('media-preview-container');
    const captionInput = document.getElementById('caption-input');
    const mainContainer = document.getElementById('main-container');
    
    // Function to add animation class to container
    function addAnimation(animationClass) {
        mainContainer.classList.add(animationClass);
        // Remove animation class after animation completes
        setTimeout(() => {
            mainContainer.classList.remove(animationClass);
        }, 500);
    }
    
    // Profile button - redirect to profile page with animation
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                window.location.href = 'profilepage.php';
            }, 300);
        });
    }
    
    // Home button - refresh the page with animation
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                window.location.href = 'homepage.php';
            }, 300);
        });
    }
    
    // Add button - show post creation page with animation
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                homePageContent.classList.add('hidden');
                postPageContent.classList.remove('hidden');
                mainContainer.classList.remove('blur-it');
            }, 300);
        });
    }
    
    // Close post button - hide post creation page with animation
    if (closePostBtn) {
        closePostBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                postPageContent.classList.add('hidden');
                homePageContent.classList.remove('hidden');
                mainContainer.classList.remove('blur-it');
                // Clear the form
                captionInput.value = '';
                fileInput.value = '';
                mediaPreviewContainer.innerHTML = '';
                mediaPreviewContainer.style.display = 'none';
            }, 300);
        });
    }
    
    // File input handling for post creation
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    mediaPreviewContainer.innerHTML = '';
                    if (file.type.includes('image')) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        mediaPreviewContainer.appendChild(img);
                    } else if (file.type.includes('video')) {
                        const video = document.createElement('video');
                        video.src = e.target.result;
                        video.controls = true;
                        mediaPreviewContainer.appendChild(video);
                    }
                    mediaPreviewContainer.style.display = 'flex';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Logout button - show logout popup
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logoutPopup.classList.remove('hidden');
        });
    }
    
    // Logout confirm button - redirect to logout with animation
    if (logoutConfirmBtn) {
        logoutConfirmBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                window.location.href = 'logout.php';
            }, 300);
        });
    }
    
    // Logout cancel button - hide logout popup
    if (logoutCancelBtn) {
        logoutCancelBtn.addEventListener('click', function() {
            logoutPopup.classList.add('hidden');
        });
    }
    
    // About button - show about popup
    if (aboutBtn) {
        aboutBtn.addEventListener('click', function() {
            aboutPopup.classList.remove('hidden');
        });
    }
    
    // About close button - hide about popup
    if (aboutCloseBtn) {
        aboutCloseBtn.addEventListener('click', function() {
            aboutPopup.classList.add('hidden');
        });
    }
    
    // Add click outside to close popups
    window.addEventListener('click', function(e) {
        if (e.target === logoutPopup) {
            logoutPopup.classList.add('hidden');
        }
        if (e.target === aboutPopup) {
            aboutPopup.classList.add('hidden');
        }
        // Removed settingsPopup from here as it's no longer on homepage
    });
});
