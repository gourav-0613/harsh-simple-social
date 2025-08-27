// Nexus Custom Popup System
class NexusPopup {
    constructor() {
        this.overlay = document.getElementById('nexus-popup-overlay');
        this.popup = document.getElementById('nexus-popup');
        this.title = document.getElementById('nexus-popup-title');
        this.message = document.getElementById('nexus-popup-message');
        this.button = document.getElementById('nexus-popup-btn');
        
        this.init();
    }
    
    init() {
        // Close popup when clicking button
        if (this.button) {
            this.button.addEventListener('click', () => {
                this.hide();
            });
        }
        
        // Close popup when clicking overlay
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.hide();
                }
            });
        }
    }
    
    show(type, title, message, duration = null) {
        if (!this.overlay || !this.popup) return;
        
        // Reset classes
        this.popup.className = 'nexus-popup';
        
        // Add type class
        this.popup.classList.add(type);
        
        // Set content
        this.title.textContent = title;
        this.message.textContent = message;
        
        // Show popup
        this.overlay.classList.add('show');
        
        // Auto hide after duration
        if (duration) {
            setTimeout(() => {
                this.hide();
            }, duration);
        }
    }
    
    hide() {
        if (this.overlay) {
            this.overlay.classList.remove('show');
        }
    }
    
    // Predefined popup types
    success(title, message, duration = 3000) {
        this.show('success', title, message, duration);
    }
    
    error(title, message, duration = 4000) {
        this.show('error', title, message, duration);
    }
    
    loading(title, message) {
        this.show('loading', title, message);
        
        // Add loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        this.popup.insertBefore(spinner, this.popup.firstChild);
    }
    
    info(title, message, duration = 3000) {
        this.show('info', title, message, duration);
    }
    
    warning(title, message, duration = 3000) {
        this.show('warning', title, message, duration);
    }
}

// Initialize popup system
let nexusPopup;
document.addEventListener('DOMContentLoaded', function() {
    nexusPopup = new NexusPopup();
});

// Global functions for easy access
function showSuccessPopup(title, message, duration = 3000) {
    if (nexusPopup) {
        nexusPopup.success(title, message, duration);
    }
}

function showErrorPopup(title, message, duration = 4000) {
    if (nexusPopup) {
        nexusPopup.error(title, message, duration);
    }
}

function showLoadingPopup(title, message) {
    if (nexusPopup) {
        nexusPopup.loading(title, message);
    }
}

function showInfoPopup(title, message, duration = 3000) {
    if (nexusPopup) {
        nexusPopup.info(title, message, duration);
    }
}

function showWarningPopup(title, message, duration = 3000) {
    if (nexusPopup) {
        nexusPopup.warning(title, message, duration);
    }
}

function hidePopup() {
    if (nexusPopup) {
        nexusPopup.hide();
    }
}