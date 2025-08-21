// This file is now replaced by enhanced_home.js
// Keeping this file for backward compatibility
document.addEventListener('DOMContentLoaded', function() {
    // Redirect to enhanced version
    if (typeof loadPosts === 'undefined') {
        // Load the enhanced version
        const script = document.createElement('script');
        script.src = 'enhanced_home.js';
        document.head.appendChild(script);
    }
});