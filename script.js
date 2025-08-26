document.addEventListener("DOMContentLoaded", function () {

  const signUpButton = document.getElementById('signUpButton');
  const signInButton = document.getElementById('signInButton');
  const signInForm = document.getElementById('signIn'); // Still targets by ID
  const signUpForm = document.getElementById('signup'); // Still targets by ID

  if (signUpButton) {
    signUpButton.addEventListener('click', function () {
      signInForm.classList.remove('visible');
      signInForm.classList.add('hidden');
      signUpForm.classList.remove('hidden');
      signUpForm.classList.add('visible');
    });
  }
  
  if (signInButton) {
    signInButton.addEventListener('click', function () {
      signInForm.classList.remove('hidden');
      signInForm.classList.add('visible');
      signUpForm.classList.remove('visible');
      signUpForm.classList.add('hidden');
    });
  }

  // Add login animation
  const loginForm = document.querySelector('form[action="register.php"]');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      const formData = new FormData(loginForm);
      if (formData.get('signIn')) {
        // Show Nexus loading popup
        if (typeof showLoadingPopup === 'function') {
          showLoadingPopup('Signing In...', 'Please wait while we verify your credentials...');
        }
      }
      if (formData.get('signUp')) {
        // Show Nexus loading popup for signup
        if (typeof showLoadingPopup === 'function') {
          showLoadingPopup('Creating Account...', 'Please wait while we create your account...');
        }
      }
    });
  }
  
  // Check if user came from search engine
  checkRedirectCondition();
  
  function checkRedirectCondition() {
    // Check if user came from search engine or direct access
    const referrer = document.referrer;
    const isFromSearchEngine = referrer && (
      referrer.includes('google.com') ||
      referrer.includes('bing.com') ||
      referrer.includes('yahoo.com') ||
      referrer.includes('duckduckgo.com')
    );
    
    // Show redirect popup if not from search engine
    if (!isFromSearchEngine && !sessionStorage.getItem('nexus_visited') && !localStorage.getItem('nexus_no_redirect')) {
      showRedirectPopup();
      sessionStorage.setItem('nexus_visited', 'true');
    }
  }
  
  function showRedirectPopup() {
    if (typeof showLoadingPopup === 'function') {
      showLoadingPopup('Welcome to Nexus', 'Preparing your social experience...');
      
      // Auto hide after 3 seconds
      setTimeout(() => {
        if (typeof hidePopup === 'function') {
          hidePopup();
        }
      }, 3000);
    }
  }

  /* help model java script by Gourav */

  const helpBtn = document.getElementById("helpBtn");
  const helpModal = document.getElementById("helpModal");
  const closeHelp = document.getElementById("closeHelp");
  const submitQueryButton = document.getElementById("submitQueryButton");
  const submissionSuccessModal = document.getElementById("submissionSuccessModal");
  const okButton = document.getElementById("okButton");

  if (helpBtn) {
    helpBtn.addEventListener("click", function () {
      helpModal.style.display = "block";
    });
  }

  if (closeHelp) {
    closeHelp.addEventListener("click", function () {
      helpModal.style.display = "none";
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === helpModal) {
      helpModal.style.display = "none";
    }
  });

  if (submitQueryButton) {
    submitQueryButton.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default form submission
      
      // Get form data
      const query = document.getElementById('helpQuery').value;
      const email = document.getElementById('helpEmail').value;
      
      // Validate inputs
      if (!query || !email) {
        if (typeof showErrorPopup === 'function') {
          showErrorPopup('Error', 'Please fill out both query and email fields.');
        }
        return;
      }
      
      // Submit form data via AJAX
      const formData = new FormData();
      formData.append('helpQuery', query);
      formData.append('helpEmail', email);
      formData.append('submitQueryButton', 'true');
      
      fetch('helpQuerySubmit.php', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        console.log('Response received:', response);
        return response.json(); // Ensure this is set to handle JSON
      })
      .then(data => {
        helpModal.style.display = "none";
        // Show success popup
        if (typeof showSuccessPopup === 'function') {
            showSuccessPopup('Query Submitted!', 'Your query has been successfully submitted. We will get back to you shortly!', 3000);
        } else {
            submissionSuccessModal.style.display = "block";
        }
      })
      .catch(error => {
        console.error('Error:', error);
        if (typeof showErrorPopup === 'function') {
            showErrorPopup('Error', 'There was a problem submitting your query. Please try again.');
        }
      });
    });
  }

  if (okButton) {
    okButton.addEventListener("click", function () {
      submissionSuccessModal.style.display = "none";
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === submissionSuccessModal) {
      submissionSuccessModal.style.display = "none";
    }
  });


  /* contact Us button */
  const contactModal = document.getElementById("contactModal");
  const btn = document.getElementById("contactBtn");
  const span = document.getElementById("contactclose-btn");

  if (btn) {
    btn.onclick = function () {
      contactModal.style.display = "block";
    };
  }

  if (span) {
    span.onclick = function () {
      contactModal.style.display = "none";
    };
  }

  window.onclick = function (event) {
    if (event.target == contactModal) {
      contactModal.style.display = "none";
    }
  };

});
