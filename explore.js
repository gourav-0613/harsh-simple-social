document.addEventListener('DOMContentLoaded', function() {
    const exploreGrid = document.getElementById('explore-grid');
    const searchInput = document.getElementById('search-input');
    const homeBtn = document.getElementById('home-btn');
    const profileBtn = document.getElementById('profile-btn');
    const addBtn = document.getElementById('add-btn');
    const messagesBtn = document.getElementById('messages-btn');
    const notificationsBtn = document.getElementById('notifications-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const logoutConfirmBtn = document.getElementById('logout-confirm-btn');
    const logoutCancelBtn = document.getElementById('logout-cancel-btn');
    const logoutPopup = document.getElementById('logout-popup');
    const mainContainer = document.getElementById('main-container');
    
    // Function to add animation class to container
    function addAnimation(animationClass) {
        if (mainContainer) {
            mainContainer.classList.add(animationClass);
            setTimeout(() => {
                mainContainer.classList.remove(animationClass);
            }, 500);
        }
    }
    
    // Navigation event listeners
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                window.location.href = 'homepage.php';
            }, 300);
        });
    }
    
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                window.location.href = 'profilepage.php';
            }, 300);
        });
    }
    
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                window.location.href = 'homepage.php'; // Or the correct page for adding posts
            }, 300);
        });
    }
    
    if (messagesBtn) {
        messagesBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                window.location.href = 'messages.php';
            }, 300);
        });
    }
    
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                window.location.href = 'notifications.php';
            }, 300);
        });
    }
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (logoutPopup) {
                logoutPopup.classList.remove('hidden');
            }
        });
    }
    
    if (logoutConfirmBtn) {
        logoutConfirmBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                window.location.href = 'logout.php';
            }, 300);
        });
    }
    
    if (logoutCancelBtn) {
        logoutCancelBtn.addEventListener('click', function() {
            if (logoutPopup) {
                logoutPopup.classList.add('hidden');
            }
        });
    }
    
    // Close popup when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === logoutPopup) {
            logoutPopup.classList.add('hidden');
        }
    });
    
    // Load explore posts on page load
    loadExplorePosts();
    
    // Search functionality
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = this.value.trim();
                if (query) {
                    searchUsers(query);
                } else {
                    loadExplorePosts(); // Go back to showing posts if search is cleared
                }
            }, 300);
        });
    }
    
    // Load explore posts function
    function loadExplorePosts() {
        if (exploreGrid) {
            exploreGrid.innerHTML = '<p class="no-posts-message">Search for users to get started.</p>';
        }
    }
    
    // Search users function with improved error handling
    function searchUsers(query) {
        fetch(`search_users.php?q=${encodeURIComponent(query)}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error('Server error: ' + text) });
                }
                return response.json();
            })
            .then(data => {
                if (!exploreGrid) return;
                exploreGrid.innerHTML = '';
                
                if (data.error) {
                    exploreGrid.innerHTML = `<p class="no-posts-message">Error: ${data.error}</p>`;
                    return;
                }
                
                if (data.length === 0) {
                    exploreGrid.innerHTML = '<p class="no-posts-message">No users found.</p>';
                    return;
                }
                
                data.forEach(user => {
                    const userElement = createUserElement(user);
                    exploreGrid.appendChild(userElement);
                });
            })
            .catch(error => {
                console.error('Error searching users:', error);
                if (exploreGrid) {
                    exploreGrid.innerHTML = `<p class="no-posts-message">An error occurred while searching. Please check the console for details.</p>`;
                }
            });
    }
    
    // Create user element for search results
    function createUserElement(user) {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-result';
        
        const profilePic = user.profile_picture || `https://placehold.co/60x60/415A77/FFFFFF?text=${user.username.charAt(0).toUpperCase()}`;

        userDiv.innerHTML = `
            <div class="user-avatar" style="background-image: url('${profilePic}')"></div>
            <div class="user-info">
                <h3>${user.username}</h3>
                <p>${user.firstName} ${user.lastName}</p>
                <p>${user.followers_count} followers</p>
            </div>
        `;
        
        // **FIXED**: Navigate to the correct public profile page with the username
        userDiv.addEventListener('click', () => {
            window.location.href = `public_profile.php?user=${user.username}`;
        });
        
        return userDiv;
    }
});
