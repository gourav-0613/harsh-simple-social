document.addEventListener('DOMContentLoaded', function() {
    const profileContainer = document.getElementById('profile-container');
    const userPostsContainer = document.getElementById('user-posts-container');
    const viewArchiveBtn = document.getElementById('view-archive-btn');

    const profileHomeBtn = document.getElementById('profile-home-btn');
    const profileSettingsBtn = document.getElementById('profile-settings-btn');
    const profileActivityBtn = document.getElementById('profile-activity-btn');
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

    // Load user posts
    loadUserPosts();

    // --- Dark Mode Initialization and Toggle ---
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.documentElement.classList.add('dark-mode');
        if(darkModeToggle) darkModeToggle.checked = true;
    } else {
        document.documentElement.classList.remove('dark-mode');
        if(darkModeToggle) darkModeToggle.checked = false;
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
            toggleBlur(true);
            setTimeout(() => {
                window.location.href = 'activity_page.php';
            }, 300);
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
    
    // --- View Archive Button ---
    if (viewArchiveBtn) {
        viewArchiveBtn.addEventListener('click', function() {
            loadArchivedPosts();
        });
    }
    
    // Load user posts function
    function loadUserPosts() {
        fetch('api/user_posts.php')
            .then(response => response.json())
            .then(posts => {
                if (!posts || posts.error) {
                    userPostsContainer.innerHTML = `<p class="no-posts-message">${posts ? posts.error : 'Could not load posts.'}</p>`;
                    return;
                }
                if (posts.length === 0) {
                    userPostsContainer.innerHTML = '<p class="no-posts-message">No posts yet. Go to home to create one!</p>';
                    return;
                }
                
                userPostsContainer.innerHTML = '';
                posts.forEach(post => {
                    const postElement = createPostElement(post);
                    userPostsContainer.appendChild(postElement);
                });
            })
            .catch(error => {
                console.error('Error loading user posts:', error);
                userPostsContainer.innerHTML = '<p class="no-posts-message">Error loading posts. Please refresh the page.</p>';
            });
    }
    
    // Load archived posts function
    function loadArchivedPosts() {
        fetch('api/archived_posts.php')
            .then(response => response.json())
            .then(posts => {
                 if (!posts || posts.error) {
                    userPostsContainer.innerHTML = `<p class="no-posts-message">${posts ? posts.error : 'Could not load archive.'}</p>`;
                    return;
                }
                if (posts.length === 0) {
                    userPostsContainer.innerHTML = '<p class="no-posts-message">No archived posts.</p>';
                    return;
                }
                
                userPostsContainer.innerHTML = '<h3 style="grid-column: 1 / -1; text-align: center; color: var(--dark-text);">Archived Posts</h3>';
                posts.forEach(post => {
                    const postElement = createArchivedPostElement(post);
                    userPostsContainer.appendChild(postElement);
                });
            })
            .catch(error => {
                console.error('Error loading archived posts:', error);
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
                <div class="post-actions">
                    <button class="post-action-btn archive-btn" data-post-id="${post.id}">
                        <i class="fas fa-archive"></i> Archive
                    </button>
                    <button class="post-action-btn delete-btn" data-post-id="${post.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        
        const archiveBtn = postDiv.querySelector('.archive-btn');
        const deleteBtn = postDiv.querySelector('.delete-btn');
        
        archiveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            archivePost(post.id);
        });
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                deletePost(post.id);
            }
        });
        
        return postDiv;
    }
    
    function createArchivedPostElement(post) {
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
                <div class="post-actions">
                    <button class="post-action-btn unarchive-btn" data-post-id="${post.id}">
                        <i class="fas fa-undo"></i> Unarchive
                    </button>
                    <button class="post-action-btn delete-btn" data-post-id="${post.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        
        const unarchiveBtn = postDiv.querySelector('.unarchive-btn');
        const deleteBtn = postDiv.querySelector('.delete-btn');
        
        unarchiveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            unarchivePost(post.id);
        });
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                deletePost(post.id);
            }
        });
        
        return postDiv;
    }
    
    function archivePost(postId) {
        const formData = new FormData();
        formData.append('action', 'archive');
        formData.append('post_id', postId);
        
        fetch('api/user_posts.php', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadUserPosts();
            } else {
                alert('Error archiving post: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => console.error('Error archiving post:', error));
    }
    
    function unarchivePost(postId) {
        const formData = new FormData();
        formData.append('action', 'unarchive');
        formData.append('post_id', postId);
        
        fetch('api/user_posts.php', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadArchivedPosts();
            } else {
                alert('Error unarchiving post: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => console.error('Error unarchiving post:', error));
    }
    
    function deletePost(postId) {
        const formData = new FormData();
        formData.append('action', 'delete');
        formData.append('post_id', postId);
        
        fetch('api/user_posts.php', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadUserPosts();
            } else {
                alert('Error deleting post: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => console.error('Error deleting post:', error));
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