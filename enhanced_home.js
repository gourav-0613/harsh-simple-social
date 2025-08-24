// Enhanced home.js with Instagram-like features
document.addEventListener('DOMContentLoaded', function() {
    // Get all the buttons by their IDs
    const profileBtn = document.getElementById('profile-btn');
    const homeBtn = document.getElementById('home-btn');
    const addBtn = document.getElementById('add-btn');
    const exploreBtn = document.getElementById('explore-btn');
    const reelsBtn = document.getElementById('reels-btn');
    const messagesBtn = document.getElementById('messages-btn');
    const publishBtn = document.getElementById('publish-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const aboutBtn = document.getElementById('about-btn');
    const notificationsBtn = document.getElementById('notifications-btn');
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
    const locationInput = document.getElementById('location-input');
    const mainContainer = document.getElementById('main-container');
    const postsContainer = document.getElementById('posts-container');
    const storiesContainer = document.getElementById('stories-container');
    const cropContainer = document.getElementById('crop-container');
    const cropCanvas = document.getElementById('crop-canvas');
    const cropBtn = document.getElementById('crop-btn');
    const cancelCropBtn = document.getElementById('cancel-crop-btn');
    const recentForwardsContainer = document.getElementById('recent-forwards-container');
    
    let currentImageFile = null;
    let cropperInstance = null;
    
    // Function to add animation class to container
    function addAnimation(animationClass) {
        mainContainer.classList.add(animationClass);
        setTimeout(() => {
            mainContainer.classList.remove(animationClass);
        }, 500);
    }
    
    // Load posts on page load
    loadPosts();
    loadStories();
    loadRecentForwards();
    
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
    
    // Explore button
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                window.location.href = 'explore.php';
            }, 300);
        });
    }
    
    // Messages button
    if (messagesBtn) {
        messagesBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                window.location.href = 'messages.php';
            }, 300);
        });
    }
    
    // Notifications button
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                window.location.href = 'notifications.php';
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
                locationInput.value = '';
                fileInput.value = '';
                currentImageFile = null;
                mediaPreviewContainer.innerHTML = '';
                mediaPreviewContainer.style.display = 'none';
                cropContainer.classList.add('hidden');
            }, 300);
        });
    }
    
    // File input handling for post creation
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                currentImageFile = file;
                
                if (file.type.includes('image')) {
                    showDynamicImageCropper(file);
                } else if (file.type.includes('video')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        mediaPreviewContainer.innerHTML = '';
                        const video = document.createElement('video');
                        video.src = e.target.result;
                        video.controls = true;
                        video.style.maxWidth = '100%';
                        video.style.maxHeight = '400px';
                        mediaPreviewContainer.appendChild(video);
                        mediaPreviewContainer.style.display = 'flex';
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    }
    
    // Dynamic image cropping functionality
    function showDynamicImageCropper(file) {
        mediaPreviewContainer.style.display = 'none';
        cropContainer.innerHTML = '';
        cropContainer.classList.remove('hidden');
        
        const cropper = new DynamicImageCropper(cropContainer, {
            aspectRatio: 1,
            quality: 0.8,
            maxWidth: 600,
            maxHeight: 400
        });
        
        cropper.loadImage(file).then(() => {
            cropper.onCrop((croppedDataUrl) => {
                mediaPreviewContainer.innerHTML = '';
                const img = document.createElement('img');
                img.src = croppedDataUrl;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '400px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '15px';
                mediaPreviewContainer.appendChild(img);
                
                cropContainer.classList.add('hidden');
                mediaPreviewContainer.style.display = 'flex';
            });
            
            cropper.onCancel(() => {
                cropContainer.classList.add('hidden');
                fileInput.value = '';
                currentImageFile = null;
            });
        }).catch(error => {
            console.error('Error loading image for cropping:', error);
            if (typeof showErrorPopup === 'function') {
                showErrorPopup('Error', 'Could not load image for cropping');
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
    });
    
    // Load posts function
    function loadPosts() {
        fetch('api/posts.php')
            .then(response => response.json())
            .then(posts => {
                if (posts.length === 0) {
                    postsContainer.innerHTML = '<p class="no-posts-message">No posts yet. Follow some users or create your first post!</p>';
                    return;
                }
                
                postsContainer.innerHTML = '';
                posts.forEach(post => {
                    const postElement = createPostElement(post);
                    postsContainer.appendChild(postElement);
                });
            })
            .catch(error => {
                console.error('Error loading posts:', error);
                postsContainer.innerHTML = '<p class="no-posts-message">Error loading posts. Please refresh the page.</p>';
            });
    }
    
    // Create post element
    function createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post-box';
        postDiv.innerHTML = `
            <div class="post-header">
                <div class="post-avatar" style="background-image: url('${post.profile_picture || 'https://placehold.co/45x45/C6AC8F/FFFFFF?text=' + (post.post_username ? post.post_username.charAt(0).toUpperCase() : 'U')}')"></div>
                <div class="post-user-info">
                    <p class="post-username">${post.post_username || post.username}</p>
                    ${post.location ? `<p class="post-location">${post.location}</p>` : ''}
                    <p class="post-time">${formatTime(post.created_at)}</p>
                </div>
            </div>
            ${post.type === 'image' ? 
                `<img src="${post.url}" alt="Post image" style="width: 100%; height: 400px; object-fit: cover;">` : 
                `<video controls style="width: 100%; height: 400px; object-fit: cover;"><source src="${post.url}"></video>`
            }
            <div class="post-actions">
                <button class="action-btn like-btn ${post.user_liked ? 'liked' : ''}" data-post-id="${post.id}">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="action-btn comment-btn" data-post-id="${post.id}">
                    <i class="fas fa-comment"></i>
                </button>
                <button class="action-btn share-btn" data-post-id="${post.id}">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
            <div class="post-stats">
                <div class="likes-count">${post.likes_count} likes</div>
            </div>
            ${post.caption ? `
                <div class="post-caption">
                    <span class="username">${post.post_username || post.username}</span> ${post.caption}
                </div>
            ` : ''}
            <div class="comments-section" id="comments-${post.id}">
                <!-- Comments will be loaded here -->
            </div>
            <div class="add-comment">
                <input type="text" placeholder="Add a comment..." class="comment-input" data-post-id="${post.id}">
                <button class="post-comment-btn" data-post-id="${post.id}">Post</button>
            </div>
        `;
        
        // Add event listeners for like and comment
        const likeBtn = postDiv.querySelector('.like-btn');
        const commentBtn = postDiv.querySelector('.comment-btn');
        const shareBtn = postDiv.querySelector('.share-btn');
        const commentInput = postDiv.querySelector('.comment-input');
        const postCommentBtn = postDiv.querySelector('.post-comment-btn');
        
        likeBtn.addEventListener('click', () => toggleLike(post.id, likeBtn));
        commentBtn.addEventListener('click', () => loadComments(post.id));
        shareBtn.addEventListener('click', () => forwardPost(post.id, shareBtn));
        postCommentBtn.addEventListener('click', () => addComment(post.id, commentInput));
        commentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addComment(post.id, commentInput);
            }
        });
        
        return postDiv;
    }
    
    // Forward post function
    function forwardPost(postId, shareBtn) {
        const formData = new FormData();
        formData.append('action', 'forward');
        formData.append('post_id', postId);
        
        fetch('api/forwarded_posts.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success animation
                shareBtn.style.color = '#10B981';
                shareBtn.style.transform = 'scale(1.2)';
                
                setTimeout(() => {
                    shareBtn.style.color = '';
                    shareBtn.style.transform = '';
                }, 1000);
                
                // Refresh forwarded posts panel
                loadRecentForwards();
                
                // Show success popup
                if (typeof showSuccessPopup === 'function') {
                    showSuccessPopup('Post Shared', 'Post has been added to your forwards!');
                }
            } else {
                if (typeof showErrorPopup === 'function') {
                    showErrorPopup('Share Failed', data.error || 'Could not share post');
                }
            }
        })
        .catch(error => {
            console.error('Error forwarding post:', error);
            if (typeof showErrorPopup === 'function') {
                showErrorPopup('Error', 'An error occurred while sharing the post');
            }
        });
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
                // Show success animation for like
                if (typeof showSuccessPopup === 'function') {
                    showSuccessPopup('Liked!', 'You liked this post', 1500);
                }
            } else {
                likeBtn.classList.remove('liked');
            }
            
            // Update likes count
            const likesCount = likeBtn.closest('.post-box').querySelector('.likes-count');
            likesCount.textContent = `${data.likes_count} likes`;
        })
        .catch(error => console.error('Error toggling like:', error));
    }
    
    // Add comment function
    function addComment(postId, commentInput) {
        const commentText = commentInput.value.trim();
        if (!commentText) return;
        
        const formData = new FormData();
        formData.append('action', 'comment');
        formData.append('post_id', postId);
        formData.append('comment_text', commentText);
        
        fetch('api/posts.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                commentInput.value = '';
                loadComments(postId);
                // Show success popup for comment
                if (typeof showSuccessPopup === 'function') {
                    showSuccessPopup('Comment Added!', 'Your comment has been posted', 1500);
                }
            }
        })
        .catch(error => console.error('Error adding comment:', error));
    }
    
    // Load comments function
    function loadComments(postId) {
        fetch(`api/comments.php?post_id=${postId}`)
            .then(response => response.json())
            .then(comments => {
                const commentsSection = document.getElementById(`comments-${postId}`);
                commentsSection.innerHTML = '';
                
                comments.forEach(comment => {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comment';
                    commentDiv.innerHTML = `
                        <span class="username">${comment.username}</span>
                        ${comment.comment_text}
                    `;
                    commentsSection.appendChild(commentDiv);
                });
            })
            .catch(error => console.error('Error loading comments:', error));
    }
    
    // Load stories function
    function loadStories() {
        // This would load stories from the database
        // For now, we'll just show the "Add Story" option
    }
    
    // Load recent forwarded posts
    function loadRecentForwards() {
        fetch('api/forwarded_posts.php')
            .then(response => response.json())
            .then(posts => {
                if (posts.error || posts.length === 0) {
                    if (recentForwardsContainer) {
                        recentForwardsContainer.innerHTML = `
                            <div class="no-forwards-message">
                                <i class="fas fa-share"></i>
                                <p>No forwarded posts yet</p>
                                <p>Posts you share will appear here</p>
                            </div>
                        `;
                    }
                    return;
                }
                
                if (recentForwardsContainer) {
                    recentForwardsContainer.innerHTML = '';
                    posts.forEach(post => {
                        const forwardElement = createForwardElement(post);
                        recentForwardsContainer.appendChild(forwardElement);
                    });
                }
            })
            .catch(error => {
                console.error('Error loading forwarded posts:', error);
                if (recentForwardsContainer) {
                    recentForwardsContainer.innerHTML = `
                        <div class="no-forwards-message">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Error loading forwards</p>
                        </div>
                    `;
                }
            });
    }
    
    // Create forward element
    function createForwardElement(post) {
        const forwardDiv = document.createElement('div');
        forwardDiv.className = 'forward-item';
        forwardDiv.innerHTML = `
            ${post.type === 'image' ? 
                `<img src="${post.url}" alt="Forwarded post">` : 
                `<video><source src="${post.url}"></video>`
            }
            <div class="forward-info">
                <span class="forward-username">${post.post_username}</span>
                <span class="forward-time">${formatTime(post.created_at)}</span>
            </div>
        `;
        
        // Add click event to view original post
        forwardDiv.addEventListener('click', () => {
            // For now, just scroll to top of feed
            // In a full implementation, this would open the specific post
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        return forwardDiv;
    }
    
    // Update loadRecentForwards call
    function loadRecentForwardsOld() {
        if (recentForwardsContainer) {
            recentForwardsContainer.innerHTML = `
                <div class="no-forwards-message">
                    <i class="fas fa-share"></i>
                    <p>No forwarded posts yet</p>
                    <p>Posts you share will appear here</p>
                </div>
            `;
        }
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