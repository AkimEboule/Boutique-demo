let products = [];
let cart = [];

async function loadProducts() {

  try {

    const response = await fetch("products.json");

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des produits");
    }

    products = await response.json();

    displayProducts(products);
    loadCategories();

  } catch (error) {

    console.error(error);

    products = [
      {
        id: 1,
        name: "Produit de secours",
        category: "Divers",
        price: 1000,
        image: "https://via.placeholder.com/200"
      }
    ];

    displayProducts(products);
  }
}

function formatPrice(price) {
  return price.toLocaleString() + " XAF";
}

function displayProducts(productsList) {

  const container = document.getElementById("productsContainer");

  container.innerHTML = "";

  productsList.forEach(product => {

    const card = document.createElement("div");

    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">

      <h3>${product.name}</h3>

      <p>${product.category}</p>

      <p>${formatPrice(product.price)}</p>

      <button onclick="addToCart(${product.id})">
        Ajouter au panier
      </button>
    `;

    container.appendChild(card);
  });
}

function loadCategories() {

  const select = document.getElementById("categoryFilter");

  const categories = [...new Set(products.map(p => p.category))];

  categories.forEach(category => {

    const option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    select.appendChild(option);
  });
}

function addToCart(productId) {

  const product = products.find(p => p.id === productId);

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity++;
  } else {

    cart.push({
      ...product,
      quantity: 1
    });
  }

  updateCart();
}

function updateCart() {

  const tbody = document.querySelector("#cartTable tbody");

  tbody.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach(item => {

    const subtotal = item.price * item.quantity;

    total += subtotal;
    count += item.quantity;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>

      <td>${formatPrice(item.price)}</td>

      <td>${item.quantity}</td>

      <td>${formatPrice(subtotal)}</td>

      <td>

        <button onclick="increaseQty(${item.id})">+</button>

        <button onclick="decreaseQty(${item.id})">-</button>

        <button onclick="removeItem(${item.id})">
          Supprimer
        </button>

      </td>
    `;

    tbody.appendChild(row);
  });

  document.getElementById("cartTotal")
    .textContent = formatPrice(total);

  document.getElementById("cartCount")
    .textContent = count;

  saveCart();
}

function increaseQty(id) {

  const item = cart.find(item => item.id === id);

  item.quantity++;

  updateCart();
}

function decreaseQty(id) {

  const item = cart.find(item => item.id === id);

  if (item.quantity > 1) {
    item.quantity--;
  }

  updateCart();
}

function removeItem(id) {

  cart = cart.filter(item => item.id !== id);

  updateCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {

  const data = localStorage.getItem("cart");

  if (data) {

    cart = JSON.parse(data);

    updateCart();
  }
}

document.getElementById("searchInput")
.addEventListener("input", function() {

  const keyword = this.value.toLowerCase();

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(keyword)
  );

  displayProducts(filtered);
});

document.getElementById("categoryFilter")
.addEventListener("change", function() {

  const category = this.value;

  if (category === "all") {
    displayProducts(products);
    return;
  }

  const filtered = products.filter(product =>
    product.category === category
  );

  displayProducts(filtered);
});

document.getElementById("sortPrice")
.addEventListener("change", function() {

  const mode = this.value;

  let sorted = [...products];

  switch (mode) {

    case "asc":
      sorted.sort((a, b) => a.price - b.price);
      break;

    case "desc":
      sorted.sort((a, b) => b.price - a.price);
      break;

    default:
      break;
  }

  displayProducts(sorted);
});

document.getElementById("clearCartBtn")
.addEventListener("click", function() {

  cart = [];

  updateCart();
});

loadProducts();
loadCart();