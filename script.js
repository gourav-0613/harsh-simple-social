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
