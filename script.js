document.addEventListener("DOMContentLoaded", () => {
  // ---------------- AUTO-CREATE ADMIN ACCOUNT ----------------
  if (!localStorage.getItem("pawUsers")) {
    localStorage.setItem(
      "pawUsers",
      JSON.stringify([
        {
          name: "Admin",
          email: "admin@email.com",
          password: "admin123",
          role: "admin",
        },
      ]),
    );
    console.log("Admin account created: admin@email.com / admin123");
  }

  const loginForm = document.querySelector("#loginForm");
  const signupForm = document.querySelector("#signupForm");
  const addUserForm = document.querySelector("#addUserForm");

  /* ---------------- LOGIN ---------------- */
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.querySelector("#loginEmail").value.trim();
      const password = document.querySelector("#loginPassword").value.trim();

      if (!validateEmail(email)) {
        alert("Please enter a valid email.");
        return;
      }

      let users = JSON.parse(localStorage.getItem("pawUsers")) || [];
      const currentUser = users.find(
        (u) => u.email === email && u.password === password,
      );

      if (!currentUser) {
        alert("Invalid email or password.");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // Redirect based on role
      if (currentUser.role === "admin") {
        window.location.href = "admin.html"; // Admin goes to dashboard
      } else {
        window.location.href = "profile.html"; // Regular user
      }
    });
  }

  /* ---------------- SIGNUP ---------------- */
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

      let users = JSON.parse(localStorage.getItem("pawUsers")) || [];

      if (users.some((u) => u.email === email)) {
        alert("Email already registered. Please login.");
        return;
      }

      const role = "user"; // default role
      const newUser = { name, email, password, role };
      users.push(newUser);
      localStorage.setItem("pawUsers", JSON.stringify(users));

      alert("Account created successfully!");
      window.location.href = "login.html";
    });
  }

  /* ---------------- ADMIN PAGE PROTECTION ---------------- */
  if (
    window.location.pathname.includes("admin.html") ||
    window.location.pathname.includes("manage-users.html")
  ) {
    const currentUserStr = localStorage.getItem("currentUser");
    if (!currentUserStr) {
      alert("Please login first.");
      window.location.href = "login.html";
      return;
    }

    const currentUser = JSON.parse(currentUserStr);
    if (!currentUser || currentUser.role !== "admin") {
      alert("Admin access only.");
      window.location.href = "profile.html";
      return;
    }
  }
});

/* ---------------- DELETE USER ---------------- */
function deleteRow(button) {
  const row = button.parentElement.parentElement;
  const email = row.cells[2].textContent;

  let users = JSON.parse(localStorage.getItem("pawUsers")) || [];
  users = users.filter((u) => u.email !== email);
  localStorage.setItem("pawUsers", JSON.stringify(users));

  row.remove();
}

/* ---------------- EMAIL VALIDATION ---------------- */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
