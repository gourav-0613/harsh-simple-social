document.addEventListener('DOMContentLoaded', function() {
    const activityPostsContainer = document.getElementById('activity-posts-container');
    const homeBtn = document.getElementById('home-btn');
    const profileBtn = document.getElementById('profile-btn');
    const addBtn = document.getElementById('add-btn');
    const exploreBtn = document.getElementById('explore-btn');
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
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                window.location.href = 'explore.php';
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
    
    // Load activity posts on page load
    loadActivityPosts();
    
    // Load activity posts function
    function loadActivityPosts() {
        fetch('api/activity_feed.php')
            .then(response => response.json())
            .then(posts => {
                if (posts.error) {
                    activityPostsContainer.innerHTML = `<p class="no-activity-message">${posts.error}</p>`;
                    return;
                }
                
                if (posts.length === 0) {
                    activityPostsContainer.innerHTML = `
                        <div class="no-activity-message">
                            <i class="fas fa-heart"></i>
                            <p>No liked posts yet</p>
                            <p>Posts you like will appear here</p>
                        </div>
                    `;
                    return;
                }
                
                activityPostsContainer.innerHTML = '';
                posts.forEach(post => {
                    const postElement = createActivityPostElement(post);
                    activityPostsContainer.appendChild(postElement);
                });
            })
            .catch(error => {
                console.error('Error loading activity posts:', error);
                activityPostsContainer.innerHTML = '<p class="no-activity-message">Error loading activity. Please refresh the page.</p>';
            });
    }
    
    // Create activity post element
    function createActivityPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'activity-post';
        postDiv.innerHTML = `
            <div class="activity-post-header">
                <div class="activity-post-avatar" style="background-image: url('${post.profile_picture || 'https://placehold.co/45x45/C6AC8F/FFFFFF?text=' + (post.post_username ? post.post_username.charAt(0).toUpperCase() : 'U')}')"></div>
                <div class="activity-post-user-info">
                    <p class="activity-post-username">${post.post_username || post.username}</p>
                    <p class="activity-post-time">${formatTime(post.liked_at)}</p>
                </div>
                <div class="activity-liked-indicator">
                    <i class="fas fa-heart"></i> Liked
                </div>
            </div>
            ${post.type === 'image' ? 
                `<img src="${post.url}" alt="Post image" style="width: 100%; height: 400px; object-fit: cover;">` : 
                `<video controls style="width: 100%; height: 400px; object-fit: cover;"><source src="${post.url}"></video>`
            }
            <div class="activity-post-actions">
                <button class="activity-action-btn like-btn liked" data-post-id="${post.id}">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="activity-action-btn comment-btn" data-post-id="${post.id}">
                    <i class="fas fa-comment"></i>
                </button>
                <button class="activity-action-btn share-btn">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
            <div class="activity-post-stats">
                <div class="activity-likes-count">${post.likes_count} likes</div>
            </div>
            ${post.caption ? `
                <div class="activity-post-caption">
                    <span class="username">${post.post_username || post.username}</span> ${post.caption}
                </div>
            ` : ''}
        `;
        
        // Add event listeners for like button
        const likeBtn = postDiv.querySelector('.like-btn');
        likeBtn.addEventListener('click', () => toggleLike(post.id, likeBtn));
        
        return postDiv;
    }
    
    // Toggle like function
    function toggleLike(postId, likeBtn) {
        const formData = new FormData();
        formData.append('action', 'like');
        formData.append('post_id', postId);
        
        fetch('api/posts.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.liked) {
                likeBtn.classList.add('liked');
            } else {
                likeBtn.classList.remove('liked');
                // Remove post from activity feed if unliked
                likeBtn.closest('.activity-post').style.opacity = '0.5';
                setTimeout(() => {
                    loadActivityPosts(); // Refresh the feed
                }, 1000);
            }
            
            // Update likes count
            const likesCount = likeBtn.closest('.activity-post').querySelector('.activity-likes-count');
            likesCount.textContent = `${data.likes_count} likes`;
        })
        .catch(error => console.error('Error toggling like:', error));
    }
    
    // Format time function
    function formatTime(timestamp) {
        const now = new Date();
        const postTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now - postTime) / 1000);
        
        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
});