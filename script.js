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
        // Add loading animation
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '0.7';
        
        // Create loading overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0D1B2A 0%, #415A77 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          opacity: 0;
          transition: opacity 0.5s ease;
        `;
        
        overlay.innerHTML = `
          <div style="text-align: center; color: white;">
            <div style="width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p style="font-size: 1.2rem; margin: 0;">Logging you in...</p>
          </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
          overlay.style.opacity = '1';
        }, 100);
      }
    });
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
    submissionSuccessModal.style.display = "block";
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
