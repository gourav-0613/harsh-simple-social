document.addEventListener('DOMContentLoaded', function() {
    const emailVerificationForm = document.getElementById('email-verification-form');
    const passwordResetForm = document.getElementById('password-reset-form');
    const emailVerificationBox = document.getElementById('email-verification');
    const passwordResetBox = document.getElementById('password-reset');
    const verificationEmailInput = document.getElementById('verification-email');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    // Email verification form handler
    if (emailVerificationForm) {
        emailVerificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = verificationEmailInput.value.trim();
            
            if (!email) {
                showErrorPopup('Error', 'Please enter your email address');
                return;
            }
            
            // Show loading popup
            showLoadingPopup('Verifying Email', 'Please wait while we verify your email...');
            
            const formData = new FormData();
            formData.append('action', 'verify_email');
            formData.append('email', email);
            
            fetch('api/password_reset.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                hidePopup();
                
                if (data.success) {
                    showSuccessPopup('Email Verified', data.message);
                    
                    // Switch to password reset form after a delay
                    setTimeout(() => {
                        emailVerificationBox.classList.remove('visible');
                        emailVerificationBox.classList.add('hidden');
                        passwordResetBox.classList.remove('hidden');
                        passwordResetBox.classList.add('visible');
                    }, 2000);
                } else {
                    showErrorPopup('Verification Failed', data.message);
                }
            })
            .catch(error => {
                hidePopup();
                console.error('Error:', error);
                showErrorPopup('Error', 'An error occurred. Please try again.');
            });
        });
    }
    
    // Password reset form handler
    if (passwordResetForm) {
        passwordResetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (!newPassword || !confirmPassword) {
                showErrorPopup('Error', 'Please fill in both password fields');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showErrorPopup('Error', 'Passwords do not match');
                return;
            }
            
            if (newPassword.length < 6) {
                showErrorPopup('Error', 'Password must be at least 6 characters long');
                return;
            }
            
            // Show loading popup
            showLoadingPopup('Resetting Password', 'Please wait while we reset your password...');
            
            const formData = new FormData();
            formData.append('action', 'reset_password');
            formData.append('new_password', newPassword);
            formData.append('confirm_password', confirmPassword);
            
            fetch('api/password_reset.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                hidePopup();
                
                if (data.success) {
                    showSuccessPopup('Password Reset', data.message);
                    
                    // Redirect to login page after success
                    setTimeout(() => {
                        window.location.href = 'index.php';
                    }, 2000);
                } else {
                    showErrorPopup('Reset Failed', data.message);
                }
            })
            .catch(error => {
                hidePopup();
                console.error('Error:', error);
                showErrorPopup('Error', 'An error occurred. Please try again.');
            });
        });
    }
});