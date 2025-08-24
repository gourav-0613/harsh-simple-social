document.addEventListener("DOMContentLoaded", function () {

  const signUpButton = document.getElementById('signUpButton');
  const signInButton = document.getElementById('signInButton');
  const signInForm = document.getElementById('signIn'); // Still targets by ID
  const signUpForm = document.getElementById('signup'); // Still targets by ID

  signUpButton.addEventListener('click', function () {
    signInForm.classList.remove('visible');
    signInForm.classList.add('hidden');
    signUpForm.classList.remove('hidden');
    signUpForm.classList.add('visible');
  });
  signInButton.addEventListener('click', function () {
    signInForm.classList.remove('hidden');
    signInForm.classList.add('visible');
    signUpForm.classList.remove('visible');
    signUpForm.classList.add('hidden');
  });

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
    if (!isFromSearchEngine && !sessionStorage.getItem('nexus_visited')) {
      showRedirectPopup();
      sessionStorage.setItem('nexus_visited', 'true');
    }
  }
  
  function showRedirectPopup() {
    // Create redirect popup
    const redirectOverlay = document.createElement('div');
    redirectOverlay.className = 'redirect-popup-overlay';
    redirectOverlay.innerHTML = `
      <div class="redirect-popup">
        <h2>Welcome to Nexus</h2>
        <p>Preparing your social experience...</p>
        <div class="redirect-loading-spinner"></div>
        <div class="redirect-progress">
          <div class="redirect-progress-bar"></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(redirectOverlay);
    
    // Show popup
    setTimeout(() => {
      redirectOverlay.classList.add('show');
    }, 100);
    
    // Auto redirect after 3 seconds
    setTimeout(() => {
      redirectOverlay.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(redirectOverlay);
      }, 500);
    }, 3500);
  }

  /* help model java script by Gourav */

  const helpBtn = document.getElementById("helpBtn");
  const helpModal = document.getElementById("helpModal");
  const closeHelp = document.getElementById("closeHelp");
  const submitQueryButton = document.getElementById("submitQueryButton");
  const submissionSuccessModal = document.getElementById("submissionSuccessModal");
  const okButton = document.getElementById("okButton");

  helpBtn.addEventListener("click", function () {
    helpModal.style.display = "block";
  });

  closeHelp.addEventListener("click", function () {
    helpModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === helpModal) {
      helpModal.style.display = "none";
    }
  });

  submitQueryButton.addEventListener("click", function () {
    helpModal.style.display = "none";
    // Show success popup instead of modal
    if (typeof showSuccessPopup === 'function') {
      showSuccessPopup('Query Submitted!', 'Your query has been successfully submitted. We will get back to you shortly!');
    } else {
      submissionSuccessModal.style.display = "block";
    }
  });

  okButton.addEventListener("click", function () {
    submissionSuccessModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === submissionSuccessModal) {
      submissionSuccessModal.style.display = "none";
    }
  });


  /* contact Us button */
  const contactModal = document.getElementById("contactModal");
  const btn = document.getElementById("contactBtn");
  const span = document.getElementById("contactclose-btn");

  btn.onclick = function () {
    contactModal.style.display = "block";
  };

  span.onclick = function () {
    contactModal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == contactModal) {
      contactModal.style.display = "none";
    }
  };

});
