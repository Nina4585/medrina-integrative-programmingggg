document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#loginForm");
  const signupForm = document.querySelector("#signupForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.querySelector("#loginEmail").value.trim();
      const password = document.querySelector("#loginPassword").value.trim();

      if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem("pawUser"));

      if (
        !storedUser ||
        storedUser.email !== email ||
        storedUser.password !== password
      ) {
        alert("Invalid email or password.");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "profile.html";
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.querySelector("#signupName").value.trim();
      const email = document.querySelector("#signupEmail").value.trim();
      const password = document.querySelector("#signupPassword").value.trim();
      const confirmPassword = document
        .querySelector("#signupConfirmPassword")
        .value.trim();

      if (name.length < 3) {
        alert("Full name must be at least 3 characters.");
        return;
      }

      if (!validateEmail(email)) {
        alert("Enter a valid email.");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      const user = { name, email, password };

      localStorage.setItem("pawUser", JSON.stringify(user));
      alert("Account created successfully! You can now log in.");
      window.location.href = "login.html";
    });
  }

  if (window.location.pathname.includes("profile.html")) {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      alert("Please log in first.");
      window.location.href = "login.html";
    }
  }

  const logoutLinks = document.querySelectorAll("a[href='login.html']");
  logoutLinks.forEach((link) => {
    if (link.textContent.includes("Sign Out")) {
      link.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
      });
    }
  });
});

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
