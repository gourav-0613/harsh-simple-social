@@ .. @@
 document.addEventListener('DOMContentLoaded', function() {
-    // Find the messages button by its ID
-    const messagesBtn = document.getElementById('messages-btn');
+    // Find all messages buttons by their ID or class
+    const messagesBtns = document.querySelectorAll('#messages-btn, .messages-btn');
 
-    // Check if the button exists on the current page
-    if (messagesBtn) {
-        // Add a click event listener
-        messagesBtn.addEventListener('click', function(event) {
+    // Add event listeners to all messages buttons
+    messagesBtns.forEach(function(messagesBtn) {
+        messagesBtn.addEventListener('click', function(event) {
             // Prevent the button from trying to navigate to another page
             event.preventDefault();
 
-            // Show the "Coming Soon" popup
-            alert('Feature Coming Soon!'); // Fallback alert
             // This uses the function from your nexus-popups.js file
             if (typeof showInfoPopup === 'function') {
                 showInfoPopup(
-                    'Feature Coming Soon!', 
-                    'The messaging feature is under construction and will be available shortly.', 
+                    'Messages Coming Soon!', 
+                    'The messaging feature is currently under development and will be available soon. Stay tuned!', 
                     3000 // The popup will disappear after 3 seconds
                 );
             } else {
                 // Fallback alert if the popup function isn't available for some reason
-                alert('The messaging feature is under construction.');
+                alert('Messages feature coming soon! The messaging feature is currently under development.');
             }
         });
-    }
+    });
 });