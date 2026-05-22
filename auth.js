let users = [];

async function loadUsers() {

  try {

    const response = await fetch("users.json");

    if (!response.ok) {
      throw new Error("Erreur chargement utilisateurs");
    }

    users = await response.json();

  } catch (error) {

    console.error(error);
  }
}

loadUsers();

document.getElementById("loginForm")
.addEventListener("submit", function(e) {

  e.preventDefault();

  const email = document.getElementById("email")
    .value
    .trim()
    .toLowerCase();

  const password = document.getElementById("password")
    .value
    .trim();

  const message = document.getElementById("message");

  if (!email || !password) {

    message.textContent = "Veuillez remplir tous les champs.";
    message.style.color = "red";

    return;
  }

  const user = users.find(u =>
    u.email.toLowerCase() === email &&
    u.password === password
  );

  if (user) {

    message.textContent = `Bienvenue ${user.fullName}`;
    message.style.color = "green";

    sessionStorage.setItem("user", user.fullName);

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

  } else {

    message.textContent = "Email ou mot de passe incorrect.";
    message.style.color = "red";
  }
});