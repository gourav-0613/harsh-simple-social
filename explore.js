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
        mainContainer.classList.add(animationClass);
        setTimeout(() => {
            mainContainer.classList.remove(animationClass);
        }, 500);
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
                window.location.href = 'homepage.php';
            }, 300);
        });
    }
    
    if (reelsBtn) {
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
            logoutPopup.classList.remove('hidden');
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
            logoutPopup.classList.add('hidden');
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
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = this.value.trim();
            if (query) {
                searchUsers(query);
            } else {
                loadExplorePosts();
            }
        }, 300);
    });
    
    // Load explore posts function
    function loadExplorePosts() {
        fetch('api/explore.php')
            .then(response => response.json())
            .then(posts => {
                if (posts.length === 0) {
                    exploreGrid.innerHTML = '<p class="no-posts-message">No posts to explore yet. Check back later!</p>';
                    return;
                }
                
                exploreGrid.innerHTML = '';
                posts.forEach(post => {
                    const postElement = createExplorePostElement(post);
                    exploreGrid.appendChild(postElement);
                });
            })
            .catch(error => {
                console.error('Error loading explore posts:', error);
                exploreGrid.innerHTML = '<p class="no-posts-message">Error loading posts. Please refresh the page.</p>';
            });
    }
    
    // Create explore post element
    function createExplorePostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'explore-post';
        postDiv.innerHTML = `
            ${post.type === 'image' ? 
                `<img src="${post.url}" alt="Post">` : 
                `<video><source src="${post.url}"></video>`
            }
            <div class="explore-post-overlay">
                <div class="explore-post-stats">
                    <i class="fas fa-heart"></i>
                    <span>${post.likes_count}</span>
                </div>
                <div class="explore-post-stats">
                    <i class="fas fa-comment"></i>
                    <span>${post.comments_count}</span>
                </div>
            </div>
        `;
        
        // Add click event to view post details
        postDiv.addEventListener('click', () => {
            // For now, just redirect to homepage
            // In a full implementation, this would open a post modal
            window.location.href = 'homepage.php';
        });
        
        return postDiv;
    }
    
    // Search users function
    function searchUsers(query) {
        fetch(`api/search.php?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(users => {
                exploreGrid.innerHTML = '';
                
                if (users.length === 0) {
                    exploreGrid.innerHTML = '<p class="no-posts-message">No users found.</p>';
                    return;
                }
                
                users.forEach(user => {
                    const userElement = createUserElement(user);
                    exploreGrid.appendChild(userElement);
                });
            })
            .catch(error => {
                console.error('Error searching users:', error);
            });
    }
    
    // Create user element for search results
    function createUserElement(user) {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-result';
        userDiv.innerHTML = `
            <div class="user-avatar" style="background-image: url('${user.profile_picture || 'https://placehold.co/60x60/415A77/FFFFFF?text=' + (user.username ? user.username.charAt(0).toUpperCase() : 'U')}')"></div>
            <div class="user-info">
                <h3>${user.username}</h3>
                <p>${user.firstName} ${user.lastName}</p>
                <p>${user.followers_count} followers</p>
                <button class="follow-request-btn" data-user-id="${user.id}">Send Request</button>
            </div>
        `;
        
        // Add follow request functionality
        const followBtn = userDiv.querySelector('.follow-request-btn');
        followBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sendFollowRequest(user.id, followBtn);
        });
        
        userDiv.addEventListener('click', () => {
            window.location.href = `public_profile.php?user=${user.username}`;
        });
        
        return userDiv;
    }
    
    // Send follow request function
    function sendFollowRequest(userId, button) {
        const formData = new FormData();
        formData.append('action', 'send_request');
        formData.append('user_id', userId);
        
        fetch('api/follow_requests.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                button.textContent = 'Requested';
                button.disabled = true;
                button.style.background = '#95a5a6';
            } else {
                alert('Error: ' + (data.error || 'Could not send request'));
            }
        })
        .catch(error => {
            console.error('Error sending follow request:', error);
            alert('Error sending follow request');
        });
    }
});