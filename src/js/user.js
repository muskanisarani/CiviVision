document.addEventListener("DOMContentLoaded", () => {

  /* 👁 Show / Hide Password */
  document.querySelectorAll(".eye-icon").forEach(icon => {
    icon.addEventListener("click", () => {
      const input = document.getElementById(icon.dataset.target);
      input.type = input.type === "password" ? "text" : "password";
    });
  });

  /* Toggle login type */
  const loginType = document.getElementById("loginType");
  if (loginType) {
    loginType.addEventListener("change", () => {
      emailField.classList.toggle("d-none", loginType.value !== "email");
      mobileField.classList.toggle("d-none", loginType.value !== "mobile");
    });
  }

  /* LOGIN */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();

      const password = loginPassword.value;
      if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      if (loginType.value === "email" &&
          !loginEmail.value.endsWith("@gmail.com")) {
        alert("Email must end with @gmail.com");
        return;
      }

      if (loginType.value === "mobile" &&
          loginMobile.value.length !== 10) {
        alert("Mobile number must be exactly 10 digits");
        return;
      }

      window.location.href = "user_dashboard.html";
    });
  }

  /* REGISTER */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", e => {
      e.preventDefault();

      if (!regEmail.value.endsWith("@gmail.com")) {
        alert("Email must end with @gmail.com");
        return;
      }

      if (regMobile.value.length !== 10) {
        alert("Mobile number must be exactly 10 digits");
        return;
      }

      if (regPassword.value.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      if (regPassword.value !== regConfirmPassword.value) {
        alert("Passwords do not match");
        return;
      }

      alert("Registration successful!");
      window.location.href = "user_login.html";
    });
  }

});
