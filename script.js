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

// ---------------- BREED NAME MAPPING ----------------
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

// ---------------- DOG PROFILES ----------------
const dogProfiles = {
  "german shepherd": [
    {
      name: "Rex",
      age: 4,
      owner: "John Cruz",
      description: "A loyal guardian who is always alert and ready to protect.",
    },
    {
      name: "Athena",
      age: 3,
      owner: "Maria Santos",
      description:
        "Graceful and intelligent, Athena excels at learning new commands.",
    },
    {
      name: "Bolt",
      age: 2,
      owner: "Kevin Reyes",
      description:
        "Fearless and energetic, Bolt leads every adventure with excitement.",
    },
  ],
  beagle: [
    {
      name: "Scout",
      age: 2,
      owner: "Angela Lopez",
      description:
        "A curious explorer who follows every scent with excitement.",
    },
    {
      name: "Molly",
      age: 4,
      owner: "Carlo Mendoza",
      description: "A sweet companion who loves cuddles and attention.",
    },
    {
      name: "Finn",
      age: 3,
      owner: "Jessa Ramos",
      description: "Always ready for fun, Finn enjoys long walks and games.",
    },
  ],
  bulldog: [
    {
      name: "Tank",
      age: 5,
      owner: "Mark Villanueva",
      description:
        "Strong-looking but gentle, Tank enjoys relaxing most of the day.",
    },
    {
      name: "Rosie",
      age: 3,
      owner: "Ella Torres",
      description:
        "Calm and loving, Rosie enjoys peaceful moments with her owner.",
    },
    {
      name: "Bruno",
      age: 4,
      owner: "Luis Garcia",
      description: "Confident and bold, Bruno carries a charming personality.",
    },
  ],
  poodle: [
    {
      name: "Belle",
      age: 2,
      owner: "Sophia Lim",
      description:
        "Elegant and smart, Belle loves attention and performing tricks.",
    },
    {
      name: "Charlie",
      age: 3,
      owner: "Daniel Ong",
      description: "Playful and clever, always ready to show new tricks.",
    },
    {
      name: "Lulu",
      age: 1,
      owner: "Trisha Yap",
      description: "Gentle and affectionate, Lulu enjoys being around people.",
    },
  ],
  boxer: [
    {
      name: "Rocky",
      age: 3,
      owner: "Victor Santos",
      description: "Energetic and fun-loving, Rocky enjoys active playtime.",
    },
    {
      name: "Bella",
      age: 2,
      owner: "Cathy Rivera",
      description: "Protective and loving, Bella stays close to her family.",
    },
    {
      name: "Zeus",
      age: 4,
      owner: "Adrian Gomez",
      description:
        "Confident and strong, Zeus commands attention wherever he goes.",
    },
  ],
  rottweiler: [
    {
      name: "Diesel",
      age: 5,
      owner: "Arnold Bautista",
      description: "A strong protector who is deeply loyal to his owner.",
    },
    {
      name: "Ruby",
      age: 3,
      owner: "Vanessa Cruz",
      description: "Balances strength with affection, always alert and caring.",
    },
    {
      name: "Thor",
      age: 4,
      owner: "Jericho Navarro",
      description:
        "Fearless and powerful, Thor thrives in challenging situations.",
    },
  ],
  chihuahua: [
    {
      name: "Peanut",
      age: 1,
      owner: "Kimberly Reyes",
      description: "Tiny but brave, Peanut has a huge personality.",
    },
    {
      name: "Lola",
      age: 2,
      owner: "Grace Aquino",
      description: "Sassy and sweet, Lola loves being the center of attention.",
    },
    {
      name: "Chico",
      age: 1,
      owner: "Marco Dela Cruz",
      description: "Fast and playful, Chico is always on the move.",
    },
  ],
  dalmatian: [
    {
      name: "Spot",
      age: 3,
      owner: "Ethan Torres",
      description: "Loves running and showing off his unique spotted coat.",
    },
    {
      name: "Nala",
      age: 2,
      owner: "Isabella Perez",
      description: "Elegant and calm, Nala moves with natural grace.",
    },
    {
      name: "Dash",
      age: 4,
      owner: "Noah Fernandez",
      description: "Quick and adventurous, Dash loves exploring new places.",
    },
  ],
};

// ---------------- DOG SEARCH ----------------
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.querySelector("#searchBtn");
  const breedInput = document.querySelector("#breedSearchInput");
  const resultsArea = document.querySelector("#apiResults");

  searchBtn?.addEventListener("click", () => {
    const breedNameRaw = breedInput.value.trim().toLowerCase();

    if (!breedNameRaw) {
      resultsArea.innerHTML = "<p style='color:red;'>Please enter a breed!</p>";
      return;
    }

    const apiBreed = breedAPIMap[breedNameRaw];
    if (!apiBreed) {
      resultsArea.innerHTML = "<p style='color:red;'>Breed not found.</p>";
      return;
    }

    resultsArea.innerHTML = "<p>Fetching dogs...</p>";

    fetch(`https://dog.ceo/api/breed/${apiBreed}/images/random/3`)
      .then((res) => res.json())
      .then((data) => {
        resultsArea.innerHTML = "";

        const dogs = dogProfiles[breedNameRaw] || [];

        const fallbackNames = ["Buddy", "Max", "Charlie", "Rocky", "Milo"];
        const fallbackOwners = [
          "Alex Cruz",
          "Jamie Santos",
          "Chris Lopez",
          "Taylor Ramos",
          "Jordan Reyes",
        ];
        const fallbackDescriptions = [
          "Loves running around and meeting new friends.",
          "Enjoys relaxing and cuddling with its owner.",
          "Full of energy and always ready to play.",
          "Curious and playful, always exploring.",
          "Loyal and affectionate with a friendly nature.",
          "Brave and confident despite its size.",
          "Very social and loves attention.",
          "Enjoys outdoor adventures and long walks.",
          "Playful and loves chasing toys.",
          "Gentle and calm, perfect companion.",
        ];

        data.message.forEach((imgUrl, index) => {
          let dog;

          if (dogs.length > 0) {
            dog = dogs[index % dogs.length];
          } else {
            dog = {
              name: fallbackNames[index % fallbackNames.length],
              age: Math.floor(Math.random() * 5) + 1,
              owner: fallbackOwners[index % fallbackOwners.length],
              description:
                fallbackDescriptions[index % fallbackDescriptions.length],
            };
          }

          resultsArea.innerHTML += `
            <div class="api-card">
              <img src="${imgUrl}">
              <div class="api-card-info">
                <h3>${dog.name} (${breedNameRaw})</h3>
                <p><strong>Age:</strong> ${dog.age}</p>
                <p><strong>Owner:</strong> ${dog.owner}</p>
                <p>${dog.description}</p>
                <button onclick="saveDog(
                  '${dog.name}',
                  '${imgUrl}',
                  '${dog.age}',
                  '${dog.owner}',
                  '${dog.description}',
                  '${breedNameRaw}'
                )">Save</button>
              </div>
            </div>
          `;
        });
      })
      .catch(() => {
        resultsArea.innerHTML =
          "<p style='color:red;'>Error fetching dogs.</p>";
      });
  });
});

// ---------------- SAVE FUNCTION ----------------
function saveDog(name, image, age, owner, description, breed) {
  let savedDogs = JSON.parse(localStorage.getItem("savedDogs")) || [];

  const exists = savedDogs.some(
    (dog) => dog.name === name && dog.image === image,
  );

  if (exists) {
    alert("This dog is already saved!");
    return;
  }

  savedDogs.push({ name, image, age, owner, description, breed });
  localStorage.setItem("savedDogs", JSON.stringify(savedDogs));

  alert("Dog saved successfully!");
}
