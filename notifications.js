document.addEventListener('DOMContentLoaded', function() {
    const notificationsContainer = document.getElementById('notifications-container');
    const markAllReadBtn = document.getElementById('mark-all-read');
    const followRequestsBtn = document.getElementById('follow-requests-btn');
    const followRequestsContainer = document.getElementById('follow-requests-container');
    const backToNotificationsBtn = document.getElementById('back-to-notifications-btn');
    const followRequestsList = document.getElementById('follow-requests-list');
    const homeBtn = document.getElementById('home-btn');
    const profileBtn = document.getElementById('profile-btn');
    const addBtn = document.getElementById('add-btn');
    const exploreBtn = document.getElementById('explore-btn');
    const messagesBtn = document.getElementById('messages-btn');
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
    
    // Load notifications on page load
    loadNotifications();
    
    // Mark all as read functionality
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            markAllNotificationsAsRead();
        });
    }
    
    // Follow requests functionality
    if (followRequestsBtn) {
        followRequestsBtn.addEventListener('click', function() {
            showFollowRequests();
        });
    }
    
    if (backToNotificationsBtn) {
        backToNotificationsBtn.addEventListener('click', function() {
            showNotifications();
        });
    }
    
    // Show follow requests
    function showFollowRequests() {
        if (notificationsContainer && followRequestsContainer) {
            notificationsContainer.classList.add('hidden');
            followRequestsContainer.classList.remove('hidden');
            loadFollowRequests();
        }
    }
    
    // Show notifications
    function showNotifications() {
        if (notificationsContainer && followRequestsContainer) {
            followRequestsContainer.classList.add('hidden');
            notificationsContainer.classList.remove('hidden');
        }
    }
    
    // Load follow requests
    function loadFollowRequests() {
        fetch('api/follow_requests.php')
            .then(response => response.json())
            .then(requests => {
                if (!followRequestsList) return;
                if (requests.length === 0) {
                    followRequestsList.innerHTML = '<div class="no-requests-message"><i class="fas fa-user-plus" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i><p>No follow requests</p></div>';
                    return;
                }
                
                followRequestsList.innerHTML = '';
                requests.forEach(request => {
                    const requestElement = createFollowRequestElement(request);
                    followRequestsList.appendChild(requestElement);
                });
            })
            .catch(error => {
                console.error('Error loading follow requests:', error);
                if (followRequestsList) {
                    followRequestsList.innerHTML = '<div class="no-requests-message">Error loading follow requests</div>';
                }
            });
    }
    
    // Create follow request element
    function createFollowRequestElement(request) {
        const requestDiv = document.createElement('div');
        requestDiv.className = 'follow-request-item';
        requestDiv.innerHTML = `
            <div class="follow-request-avatar" style="background-image: url('${request.profile_picture || 'https://placehold.co/60x60/415A77/FFFFFF?text=' + request.username.charAt(0).toUpperCase()}')"></div>
            <div class="follow-request-info">
                <h3>${request.username}</h3>
                <p>${request.firstName} ${request.lastName}</p>
            </div>
            <div class="follow-request-actions">
                <button class="accept-btn" data-requester-id="${request.requester_id}">Accept</button>
                <button class="decline-btn" data-requester-id="${request.requester_id}">Decline</button>
            </div>
        `;
        
        const acceptBtn = requestDiv.querySelector('.accept-btn');
        const declineBtn = requestDiv.querySelector('.decline-btn');
        
        acceptBtn.addEventListener('click', () => {
            handleFollowRequestAction('accept', request.requester_id, requestDiv);
        });
        
        declineBtn.addEventListener('click', () => {
            handleFollowRequestAction('decline', request.requester_id, requestDiv);
        });
        
        return requestDiv;
    }
    
    // Handle follow request action
    function handleFollowRequestAction(action, requesterId, requestElement) {
        const formData = new FormData();
        formData.append('action', action + '_request');
        formData.append('requester_id', requesterId);
        
        fetch('api/follow_requests.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                requestElement.style.opacity = '0';
                requestElement.style.transform = 'translateX(100px)';
                setTimeout(() => {
                    requestElement.remove();
                    
                    if (followRequestsList && followRequestsList.children.length === 0) {
                        followRequestsList.innerHTML = '<div class="no-requests-message"><i class="fas fa-user-plus" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i><p>No follow requests</p></div>';
                    }
                }, 300);
                
                if (typeof showSuccessPopup === 'function') {
                    showSuccessPopup('Request ' + (action === 'accept' ? 'Accepted' : 'Declined'), 
                        'Follow request has been ' + (action === 'accept' ? 'accepted' : 'declined'));
                }
            } else {
                if (typeof showErrorPopup === 'function') {
                    showErrorPopup('Error', data.error || 'Could not process request');
                }
            }
        })
        .catch(error => {
            console.error('Error handling follow request:', error);
            if (typeof showErrorPopup === 'function') {
                showErrorPopup('Error', 'An error occurred while processing the request');
            }
        });
    }
    
    // Load notifications function
    function loadNotifications() {
        fetch('api/notifications.php')
            .then(response => response.json())
            .then(notifications => {
                if (!notificationsContainer) return;
                if (notifications.length === 0) {
                    notificationsContainer.innerHTML = '<p class="no-notifications-message">No notifications yet. When someone likes or comments on your posts, you\'ll see it here!</p>';
                    return;
                }
                
                notificationsContainer.innerHTML = '';
                notifications.forEach(notification => {
                    const notificationElement = createNotificationElement(notification);
                    notificationsContainer.appendChild(notificationElement);
                });
            })
            .catch(error => {
                console.error('Error loading notifications:', error);
                if (notificationsContainer) {
                    notificationsContainer.innerHTML = '<p class="no-notifications-message">Error loading notifications. Please refresh the page.</p>';
                }
            });
    }
    
    // Create notification element
    function createNotificationElement(notification) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification-item ${notification.is_read == 0 ? 'unread' : ''}`;
        notificationDiv.dataset.notificationId = notification.id;
        
        const iconClass = getNotificationIcon(notification.type);
        
        let actionButtons = '';
        if (notification.type === 'follow_request') {
            actionButtons = `
                <div class="notification-actions">
                    <button class="accept-request-btn" data-requester-id="${notification.from_user_id}">Accept</button>
                    <button class="decline-request-btn" data-requester-id="${notification.from_user_id}">Decline</button>
                </div>
            `;
        }
        
        notificationDiv.innerHTML = `
            <div class="notification-avatar" style="background-image: url('https://placehold.co/50x50/415A77/FFFFFF?text=${notification.from_username.charAt(0).toUpperCase()}')"></div>
            <div class="notification-content">
                <p class="notification-text">
                    <span class="username">${notification.from_username}</span>
                    ${getNotificationMessage(notification)}
                </p>
                <p class="notification-time">${formatTime(notification.created_at)}</p>
                ${actionButtons}
            </div>
            <div class="notification-icon ${notification.type}">
                <i class="${iconClass}"></i>
            </div>
        `;
        
        if (notification.type === 'follow_request') {
            const acceptBtn = notificationDiv.querySelector('.accept-request-btn');
            const declineBtn = notificationDiv.querySelector('.decline-request-btn');
            
            acceptBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleFollowRequest('accept', notification.from_user_id, notificationDiv);
            });
            
            declineBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleFollowRequest('decline', notification.from_user_id, notificationDiv);
            });
        }
        
        notificationDiv.addEventListener('click', () => {
            markNotificationAsRead(notification.id);
            
            if (notification.post_id && (notification.type === 'like' || notification.type === 'comment')) {
                window.location.href = 'homepage.php';
            } else if (notification.type === 'follow') {
                window.location.href = `public_profile.php?user=${notification.from_username}`;
            }
        });
        
        return notificationDiv;
    }
    
    // Handle follow request actions
    function handleFollowRequest(action, requesterId, notificationElement) {
        const formData = new FormData();
        formData.append('action', action + '_request');
        formData.append('requester_id', requesterId);
        
        fetch('api/follow_requests.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                notificationElement.style.opacity = '0.5';
                const actions = notificationElement.querySelector('.notification-actions');
                if (actions) {
                    actions.innerHTML = `<span style="color: var(--dusty-blue); font-size: 0.9rem;">${action === 'accept' ? 'Accepted' : 'Declined'}</span>`;
                }
            } else {
                alert('Error: ' + (data.error || 'Could not process request'));
            }
        })
        .catch(error => {
            console.error('Error handling follow request:', error);
            alert('Error processing request');
        });
    }
    
    // Get notification icon based on type
    function getNotificationIcon(type) {
        switch (type) {
            case 'like': return 'fas fa-heart';
            case 'comment': return 'fas fa-comment';
            case 'follow': return 'fas fa-user-plus';
            case 'follow_request': return 'fas fa-user-clock';
            case 'follow_accept': return 'fas fa-user-check';
            case 'message': return 'fas fa-envelope';
            default: return 'fas fa-bell';
        }
    }
    
    // Get notification message based on type
    function getNotificationMessage(notification) {
        switch (notification.type) {
            case 'like': return 'liked your post';
            case 'comment': return 'commented on your post';
            case 'follow': return 'started following you';
            case 'follow_request': return 'sent you a follow request';
            case 'follow_accept': return 'accepted your follow request';
            case 'message': return 'sent you a message';
            default: return notification.message;
        }
    }
    
    // Mark notification as read
    function markNotificationAsRead(notificationId) {
        const formData = new FormData();
        formData.append('action', 'mark_read');
        formData.append('notification_id', notificationId);
        
        fetch('api/notifications.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const notificationElement = document.querySelector(`[data-notification-id="${notificationId}"]`);
                if (notificationElement) {
                    notificationElement.classList.remove('unread');
                }
            }
        })
        .catch(error => console.error('Error marking notification as read:', error));
    }
    
    // Mark all notifications as read
    function markAllNotificationsAsRead() {
        const formData = new FormData();
        formData.append('action', 'mark_all_read');
        
        fetch('api/notifications.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelectorAll('.notification-item.unread').forEach(item => {
                    item.classList.remove('unread');
                });
            }
        })
        .catch(error => console.error('Error marking all notifications as read:', error));
    }
    
    // Format time function
    function formatTime(timestamp) {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now - notificationTime) / 1000);
        
        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return `${Math.floor(diffInSeconds / 604800)}w ago`;
    }
});
