document.addEventListener('DOMContentLoaded', function() {
    const notificationsContainer = document.getElementById('notifications-container');
    const markAllReadBtn = document.getElementById('mark-all-read');
    const homeBtn = document.getElementById('home-btn');
    const profileBtn = document.getElementById('profile-btn');
    const addBtn = document.getElementById('add-btn');
    const exploreBtn = document.getElementById('explore-btn');
    const reelsBtn = document.getElementById('reels-btn');
    const messagesBtn = document.getElementById('messages-btn');
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
    
    if (reelsBtn) {
        reelsBtn.addEventListener('click', function() {
            addAnimation('blur-it');
            setTimeout(() => {
                window.location.href = 'reels.php';
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
    
    // Load notifications on page load
    loadNotifications();
    
    // Mark all as read functionality
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            markAllNotificationsAsRead();
        });
    }
    
    // Load notifications function
    function loadNotifications() {
        fetch('api/notifications.php')
            .then(response => response.json())
            .then(notifications => {
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
                notificationsContainer.innerHTML = '<p class="no-notifications-message">Error loading notifications. Please refresh the page.</p>';
            });
    }
    
    // Create notification element
    function createNotificationElement(notification) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = `notification-item ${notification.is_read == 0 ? 'unread' : ''}`;
        notificationDiv.dataset.notificationId = notification.id;
        
        const iconClass = getNotificationIcon(notification.type);
        
        notificationDiv.innerHTML = `
            <div class="notification-avatar" style="background-image: url('https://placehold.co/50x50/8897AA/FFFFFF?text=${notification.from_username.charAt(0).toUpperCase()}')"></div>
            <div class="notification-content">
                <p class="notification-text">
                    <span class="username">${notification.from_username}</span>
                    ${getNotificationMessage(notification)}
                </p>
                <p class="notification-time">${formatTime(notification.created_at)}</p>
            </div>
            <div class="notification-icon ${notification.type}">
                <i class="${iconClass}"></i>
            </div>
        `;
        
        // Add click event to mark as read and navigate if needed
        notificationDiv.addEventListener('click', () => {
            markNotificationAsRead(notification.id);
            
            // Navigate based on notification type
            if (notification.post_id && (notification.type === 'like' || notification.type === 'comment')) {
                window.location.href = 'homepage.php'; // In a full implementation, this would open the specific post
            } else if (notification.type === 'follow') {
                window.location.href = `profile.php?user=${notification.from_username}`;
            }
        });
        
        return notificationDiv;
    }
    
    // Get notification icon based on type
    function getNotificationIcon(type) {
        switch (type) {
            case 'like':
                return 'fas fa-heart';
            case 'comment':
                return 'fas fa-comment';
            case 'follow':
                return 'fas fa-user-plus';
            case 'message':
                return 'fas fa-envelope';
            default:
                return 'fas fa-bell';
        }
    }
    
    // Get notification message based on type
    function getNotificationMessage(notification) {
        switch (notification.type) {
            case 'like':
                return 'liked your post';
            case 'comment':
                return 'commented on your post';
            case 'follow':
                return 'started following you';
            case 'message':
                return 'sent you a message';
            default:
                return notification.message;
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
                // Remove unread class from all notifications
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
        
        if (diffInSeconds < 60) return `${diffInSeconds}s`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
        return `${Math.floor(diffInSeconds / 604800)}w`;
    }
});