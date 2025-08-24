document.addEventListener('DOMContentLoaded', function() {
    const profileHeader = document.getElementById('profile-header');
    const userPostsContainer = document.getElementById('user-posts-container');
    const backBtn = document.getElementById('back-btn');
    const homeBtn = document.getElementById('home-btn');
    const exploreBtn = document.getElementById('explore-btn');
    const followPopup = document.getElementById('follow-popup');
    const followConfirmBtn = document.getElementById('follow-confirm-btn');
    const followCancelBtn = document.getElementById('follow-cancel-btn');
    const profileContainer = document.getElementById('profile-container');
    
    // Get username from URL
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    
    if (!username) {
        window.location.href = 'homepage.php';
        return;
    }
    
    let currentUser = null;
    let followAction = null;
    
    // Navigation
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.history.back();
        });
    }
    
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            window.location.href = 'homepage.php';
        });
    }
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            window.location.href = 'explore.php';
        });
    }
    
    // Load user profile
    loadUserProfile();
    
    function loadUserProfile() {
        fetch(`api/user_profile.php?username=${encodeURIComponent(username)}`)
            .then(response => response.json())
            .then(user => {
                if (user.error) {
                    profileHeader.innerHTML = `<p class="no-posts-message">${user.error}</p>`;
                    return;
                }
                
                currentUser = user;
                displayUserProfile(user);
                loadUserPosts();
            })
            .catch(error => {
                console.error('Error loading user profile:', error);
                profileHeader.innerHTML = '<p class="no-posts-message">Error loading profile.</p>';
            });
    }
    
    function displayUserProfile(user) {
        const followButtonHtml = getFollowButtonHtml(user);
        
        profileHeader.innerHTML = `
            <div class="profile-pic" style="background-image: url('${user.profile_picture || 'https://placehold.co/180x180/C6AC8F/FFFFFF?text=' + user.username.charAt(0).toUpperCase()}')"></div>
            <div class="profile-info">
                <h1 class="username">${user.username}</h1>
                <div class="stats">
                    <div><strong>${user.posts_count}</strong><br>posts</div>
                    <div><strong>${user.followers_count}</strong><br>followers</div>
                    <div><strong>${user.following_count}</strong><br>following</div>
                </div>
                <div class="bio">
                    <p><strong>${user.firstName} ${user.lastName}</strong><br><span>${user.bio || ''}</span></p>
                </div>
                ${followButtonHtml}
            </div>
        `;
        
        // Add event listeners to follow buttons
        const followBtn = profileHeader.querySelector('.follow-btn');
        if (followBtn) {
            followBtn.addEventListener('click', () => handleFollowAction(user));
        }
    }
    
    function getFollowButtonHtml(user) {
        if (user.follow_status === 'following') {
            return `
                <div class="buttons">
                    <button class="follow-btn following" data-action="unfollow">Following</button>
                    <button onclick="showInfoPopup('Message', 'Messaging feature coming soon!')">Message</button>
                </div>
            `;
        } else if (user.follow_status === 'requested') {
            return `
                <div class="buttons">
                    <button class="follow-btn requested" data-action="cancel_request">Requested</button>
                    <button onclick="showInfoPopup('Message', 'Messaging feature coming soon!')">Message</button>
                </div>
            `;
        } else {
            return `
                <div class="buttons">
                    <button class="follow-btn" data-action="follow">Follow</button>
                    <button onclick="showInfoPopup('Message', 'Messaging feature coming soon!')">Message</button>
                </div>
            `;
        }
    }
    
    function handleFollowAction(user) {
        const followBtn = profileHeader.querySelector('.follow-btn');
        const action = followBtn.dataset.action;
        
        if (action === 'follow') {
            if (user.is_private) {
                followAction = 'send_request';
                document.getElementById('follow-popup-title').textContent = 'Send Follow Request';
                document.getElementById('follow-popup-message').textContent = 'This account is private. Send a follow request?';
            } else {
                followAction = 'follow';
                document.getElementById('follow-popup-title').textContent = 'Follow User';
                document.getElementById('follow-popup-message').textContent = `Follow ${user.username}?`;
            }
            followPopup.classList.remove('hidden');
        } else if (action === 'unfollow') {
            followAction = 'unfollow';
            document.getElementById('follow-popup-title').textContent = 'Unfollow User';
            document.getElementById('follow-popup-message').textContent = `Unfollow ${user.username}?`;
            followPopup.classList.remove('hidden');
        } else if (action === 'cancel_request') {
            followAction = 'cancel_request';
            document.getElementById('follow-popup-title').textContent = 'Cancel Request';
            document.getElementById('follow-popup-message').textContent = 'Cancel follow request?';
            followPopup.classList.remove('hidden');
        }
    }
    
    // Follow popup handlers
    if (followConfirmBtn) {
        followConfirmBtn.addEventListener('click', () => {
            executeFollowAction();
            followPopup.classList.add('hidden');
        });
    }
    
    if (followCancelBtn) {
        followCancelBtn.addEventListener('click', () => {
            followPopup.classList.add('hidden');
        });
    }
    
    function executeFollowAction() {
        const formData = new FormData();
        
        if (followAction === 'follow') {
            formData.append('action', 'follow');
            formData.append('user_id', currentUser.id);
            
            fetch('api/follow.php', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    if (data.following !== undefined) {
                        showSuccessPopup('Success', data.following ? 'Now following user!' : 'Unfollowed user');
                        loadUserProfile(); // Refresh profile
                    }
                })
                .catch(error => console.error('Error:', error));
        } else if (followAction === 'send_request') {
            formData.append('action', 'send_request');
            formData.append('user_id', currentUser.id);
            
            fetch('api/follow_requests.php', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showSuccessPopup('Request Sent', 'Follow request sent successfully!');
                        loadUserProfile(); // Refresh profile
                    } else {
                        showErrorPopup('Error', data.error || 'Could not send request');
                    }
                })
                .catch(error => console.error('Error:', error));
        } else if (followAction === 'unfollow') {
            formData.append('action', 'follow'); // Same endpoint, will unfollow if already following
            formData.append('user_id', currentUser.id);
            
            fetch('api/follow.php', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    if (data.following !== undefined) {
                        showSuccessPopup('Success', 'Unfollowed user');
                        loadUserProfile(); // Refresh profile
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }
    
    function loadUserPosts() {
        fetch(`api/user_posts_public.php?username=${encodeURIComponent(username)}`)
            .then(response => response.json())
            .then(posts => {
                if (posts.error) {
                    if (posts.error === 'Private account') {
                        userPostsContainer.innerHTML = '<div class="private-account-message"><i class="fas fa-lock" style="font-size: 2rem; margin-bottom: 10px;"></i><p>This account is private</p><p>Follow to see their posts</p></div>';
                    } else {
                        userPostsContainer.innerHTML = `<p class="no-posts-message">${posts.error}</p>`;
                    }
                    return;
                }
                
                if (posts.length === 0) {
                    userPostsContainer.innerHTML = '<p class="no-posts-message">No posts yet.</p>';
                    return;
                }
                
                userPostsContainer.innerHTML = '';
                posts.forEach(post => {
                    const postElement = createPostElement(post);
                    userPostsContainer.appendChild(postElement);
                });
            })
            .catch(error => {
                console.error('Error loading posts:', error);
                userPostsContainer.innerHTML = '<p class="no-posts-message">Error loading posts.</p>';
            });
    }
    
    function createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post-grid-item';
        postDiv.innerHTML = `
            ${post.type === 'image' ? 
                `<img src="${post.url}" alt="Post">` : 
                `<video><source src="${post.url}"></video>`
            }
            <div class="post-overlay">
                <div class="post-stats">
                    <span><i class="fas fa-heart"></i> ${post.likes_count}</span>
                    <span><i class="fas fa-comment"></i> ${post.comments_count}</span>
                </div>
            </div>
        `;
        
        return postDiv;
    }
    
    // Close popup when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === followPopup) {
            followPopup.classList.add('hidden');
        }
    });
});