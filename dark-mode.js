// File: dark-mode.js

/**
 * This script handles the dark mode functionality for the entire website.
 * It reads the user's preference from localStorage and applies the theme.
 * It also adds an event listener to the dark mode toggle on the settings page.
 */
(function() {
    const THEME_KEY = 'darkMode';

    // Function to apply the theme by adding or removing the 'dark-mode' class from the <html> element
    const applyTheme = () => {
        const theme = localStorage.getItem(THEME_KEY);
        if (theme === 'enabled') {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    };

    // Apply the theme as soon as the script is loaded to prevent a "flash" of the light theme
    applyTheme();

    // Wait for the full DOM to be loaded before trying to access the toggle switch
    document.addEventListener('DOMContentLoaded', () => {
        const darkModeToggle = document.getElementById('darkModeToggle');

        // If the toggle switch exists on the page, set its initial state and add a listener
        if (darkModeToggle) {
            // Set the toggle's checked state based on the saved theme
            if (localStorage.getItem(THEME_KEY) === 'enabled') {
                darkModeToggle.checked = true;
            }

            // Listen for changes on the toggle switch
            darkModeToggle.addEventListener('change', function() {
                if (this.checked) {
                    // If checked, enable dark mode
                    document.documentElement.classList.add('dark-mode');
                    localStorage.setItem(THEME_KEY, 'enabled');
                } else {
                    // If unchecked, disable dark mode
                    document.documentElement.classList.remove('dark-mode');
                    localStorage.setItem(THEME_KEY, 'disabled');
                }
            });
        }
    });
})();
