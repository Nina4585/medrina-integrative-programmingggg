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
// ---------------- DOG BREED DESCRIPTIONS ----------------
const dogDescriptions = {
  beagle:
    "A friendly and curious small hound known for its excellent sense of smell.",
  pug: "A small, charming dog with a wrinkled face and playful personality.",
  labrador: "A loyal and intelligent family dog, great for companionship.",
  retriever: "Friendly and active dogs known for their love of fetching.",
  "german shepherd":
    "A strong and intelligent working dog often used in police roles.",
  bulldog: "A calm and courageous dog with a muscular build.",
  poodle: "An intelligent and elegant dog, easy to train.",
  rottweiler: "A powerful and protective dog known for loyalty.",
  husky: "An energetic sled dog known for its striking appearance.",
  dalmatian: "A unique spotted dog known for its energy and elegance.",
  chihuahua: "A tiny but confident dog with a big personality.",
  doberman: "A fast, alert, and fearless guard dog.",
  akita: "A large and loyal dog originally from Japan.",
  boxer: "A playful and energetic dog, great with families.",
  corgi: "A small herding dog with short legs and a cheerful nature.",
  shiba: "A spirited and independent Japanese breed.",
  mastiff: "A giant dog known for being gentle and protective.",
  hound: "A hunting dog with a strong sense of smell.",
  terrier: "A lively and brave dog, small but fearless.",
  spaniel: "A gentle and affectionate companion dog.",
  "golden retriever": "Friendly, intelligent, and devoted family dog.",
};

// ---------------- BREED NAME MAPPING FOR API ----------------
const breedAPIMap = {
  "german shepherd": "german/shepherd",
  "golden retriever": "retriever/golden",
  labrador: "labrador",
  beagle: "beagle",
  pug: "pug",
  retriever: "retriever",
  bulldog: "bulldog",
  poodle: "poodle",
  rottweiler: "rottweiler",
  husky: "husky",
  dalmatian: "dalmatian",
  chihuahua: "chihuahua",
  doberman: "doberman",
  akita: "akita",
  boxer: "boxer",
  corgi: "corgi",
  shiba: "shiba",
  mastiff: "mastiff",
  hound: "hound",
  terrier: "terrier",
  spaniel: "spaniel",
};

// ---------------- DOG SEARCH + SAVE ----------------
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.querySelector("#searchBtn");
  const breedInput = document.querySelector("#breedSearchInput");
  const resultsArea = document.querySelector("#apiResults");

  searchBtn?.addEventListener("click", () => {
    const breedNameRaw = breedInput.value.trim().toLowerCase();

    if (!breedNameRaw) {
      resultsArea.innerHTML =
        "<p style='grid-column:1/-1; color:red;'>Please enter a breed!</p>";
      return;
    }

    const apiBreed = breedAPIMap[breedNameRaw];
    if (!apiBreed) {
      resultsArea.innerHTML =
        "<p style='grid-column:1/-1; color:red;'>Breed not found. Try 'husky', 'pug', or 'beagle'.</p>";
      return;
    }

    resultsArea.innerHTML = "<p style='grid-column:1/-1;'>Fetching dogs...</p>";

    // Fetch images from Dog CEO API
    fetch(`https://dog.ceo/api/breed/${apiBreed}/images/random/3`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "success") throw new Error("API error");

        resultsArea.innerHTML = "";

        const description =
          dogDescriptions[breedNameRaw] ||
          "A wonderful dog breed with unique traits and characteristics.";

        data.message.forEach((imgUrl) => {
          resultsArea.innerHTML += `
            <div class="api-card">
              <img src="${imgUrl}" alt="Dog image of ${breedNameRaw}">
              <div class="api-card-info">
                <h3>${breedNameRaw}</h3>
                <p>${description}</p>
                <button onclick="saveDog('${breedNameRaw}', '${imgUrl}')">Save</button>
              </div>
            </div>
          `;
        });
      })
      .catch(() => {
        resultsArea.innerHTML =
          "<p style='grid-column:1/-1; color:red;'>Could not fetch dogs. Try another breed.</p>";
      });
  });
});

// ---------------- SAVE FUNCTION ----------------
function saveDog(name, image) {
  // Get saved dogs from localStorage
  let savedDogs = JSON.parse(localStorage.getItem("savedDogs")) || [];

  // Check for duplicates
  const exists = savedDogs.some(
    (dog) => dog.name === name && dog.image === image,
  );
  if (exists) {
    alert("This dog is already saved!");
    return;
  }

  // Add new dog and save
  savedDogs.push({ name, image });
  localStorage.setItem("savedDogs", JSON.stringify(savedDogs));
  alert("Dog saved successfully!");
}
