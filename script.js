// ---------- FOOD MENU (BEGINNER FRIENDLY DATASET) ----------
const menuItems = [
    { id: 1, name: "Margherita Pizza", category: "Pizza", price: 299, imgEmoji: "🍕", desc: "Classic cheese & tomato" },
    { id: 2, name: "Pepperoni Pizza", category: "Pizza", price: 399, imgEmoji: "🍕🔥", desc: "Spicy pepperoni" },
    { id: 3, name: "Veg Burger", category: "Burger", price: 149, imgEmoji: "🍔", desc: "Fresh lettuce & patty" },
    { id: 4, name: "Chicken Burger", category: "Burger", price: 199, imgEmoji: "🍔🐔", desc: "Grilled chicken" },
    { id: 5, name: "Hyderabadi Biryani", category: "Biryani", price: 279, imgEmoji: "🍛", desc: "Aromatic rice & spices" },
    { id: 6, name: "Veg Biryani", category: "Biryani", price: 219, imgEmoji: "🥘", desc: "Mixed vegetables" },
    { id: 7, name: "White Sauce Pasta", category: "Pasta", price: 229, imgEmoji: "🍝", desc: "Creamy & cheesy" },
    { id: 8, name: "Red Sauce Pasta", category: "Pasta", price: 209, imgEmoji: "🍝🌶️", desc: "Tangy tomato sauce" },
    { id: 9, name: "Gulab Jamun", category: "Dessert", price: 99, imgEmoji: "🍘", desc: "2 pcs hot dessert" },
    { id: 10, name: "Chocolate Brownie", category: "Dessert", price: 129, imgEmoji: "🍫", desc: "with nuts" }
];

// ---------- GLOBAL STATE ----------
let cart = [];    // each item { id, name, price, quantity }
let activeCategory = "all";
let searchQuery = "";

// Helper: get DOM elements
const foodGrid = document.getElementById("foodItemsGrid");
const cartCountSpan = document.getElementById("cartCount");
const cartSidebar = document.getElementById("cartSidebar");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartTotalSpan = document.getElementById("cartTotalPrice");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// ---------- CART FUNCTIONS (basic) ----------
function updateCartUI() {
    // update cart count in header
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.innerText = totalItems;

    // render cart sidebar items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div class="empty-cart">Cart is empty 🍽️</div>`;
        cartTotalSpan.innerText = `Total: ₹0`;
        return;
    }

    let cartHtml = "";
    let totalPrice = 0;
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        cartHtml += `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div class="cart-item-price">₹${item.price} x ${item.quantity}</div>
          </div>
          <div class="item-actions">
            <button class="cart-decr" data-id="${item.id}">-</button>
            <span style="min-width: 20px; text-align:center;">${item.quantity}</span>
            <button class="cart-incr" data-id="${item.id}">+</button>
            <button class="cart-remove" data-id="${item.id}" style="background:#ffb3b3;">🗑️</button>
          </div>
        </div>
      `;
    }
    cartItemsContainer.innerHTML = cartHtml;
    cartTotalSpan.innerText = `Total: ₹${totalPrice}`;

    // attach event listeners to cart dynamic buttons (simple inline binding)
    document.querySelectorAll('.cart-incr').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-id'));
            updateQuantity(id, 1);
        });
    });
    document.querySelectorAll('.cart-decr').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-id'));
            updateQuantity(id, -1);
        });
    });
    document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.getAttribute('data-id'));
            removeItemFromCart(id);
        });
    });
}

function updateQuantity(itemId, change) {
    const index = cart.findIndex(i => i.id === itemId);
    if (index === -1) return;
    const newQty = cart[index].quantity + change;
    if (newQty <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].quantity = newQty;
    }
    updateCartUI();
    renderFoodGrid();   // refresh grid (to update button text maybe? but optional)
}

function removeItemFromCart(itemId) {
    cart = cart.filter(i => i.id !== itemId);
    updateCartUI();
    renderFoodGrid();
}

function addToCart(itemId) {
    const menuItem = menuItems.find(m => m.id === itemId);
    if (!menuItem) return;
    const existing = cart.find(i => i.id === itemId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1
        });
    }
    updateCartUI();
    renderFoodGrid();   // re-render to show "Added ✓" style or just keep add button but we'll show normal add button but ok.
    // optional simple animation: no need.
}

// helper to get item quantity in cart
function getCartQty(itemId) {
    const found = cart.find(i => i.id === itemId);
    return found ? found.quantity : 0;
}

// ---------- FILTER & SEARCH LOGIC (beginner style) ----------
function getFilteredItems() {
    let filtered = [...menuItems];
    // filter by category
    if (activeCategory !== "all") {
        filtered = filtered.filter(item => item.category === activeCategory);
    }
    // filter by search query (case insensitive)
    if (searchQuery.trim() !== "") {
        const lowerQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(lowerQuery) || 
            item.category.toLowerCase().includes(lowerQuery) ||
            item.desc.toLowerCase().includes(lowerQuery)
        );
    }
    return filtered;
}

function renderFoodGrid() {
    const itemsToShow = getFilteredItems();
    if (itemsToShow.length === 0) {
        foodGrid.innerHTML = `<div style="width:100%; text-align:center; padding: 40px;">🍽️ No items found 😢</div>`;
        return;
    }
    let gridHtml = "";
    for (let i = 0; i < itemsToShow.length; i++) {
        const item = itemsToShow[i];
        const qtyInCart = getCartQty(item.id);
        const buttonText = qtyInCart > 0 ? `✓ Added (${qtyInCart})` : "Add to Cart";
        // simple background color for image placeholder
        const bgColors = ["#ffe0cc", "#ffd9b5", "#ffe6d5", "#ffd9cc", "#ffe0d0"];
        const bgIndex = item.id % bgColors.length;
        gridHtml += `
        <div class="food-card">
          <div class="card-img" style="background-color: ${bgColors[bgIndex]}; font-size: 3rem;">
            ${item.imgEmoji}
          </div>
          <div class="card-info">
            <h3>${item.name}</h3>
            <span class="category-badge">${item.category}</span>
            <div class="price">₹${item.price}</div>
            <p style="font-size: 13px; color:#666; margin-bottom: 8px;">${item.desc}</p>
            <button class="add-btn" data-id="${item.id}">${buttonText}</button>
          </div>
        </div>
      `;
    }
    foodGrid.innerHTML = gridHtml;

    // attach event listeners to all add buttons
    const addBtns = document.querySelectorAll('.add-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id'));
            addToCart(id);
        });
    });
}

// category filter handlers
function setupCategoryFilters() {
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // update active class
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const catValue = btn.getAttribute('data-cat');
            activeCategory = catValue;
            renderFoodGrid();
        });
    });
}

// search handlers
function handleSearch() {
    searchQuery = searchInput.value;
    renderFoodGrid();
}

// cart sidebar open/close
function openCart() {
    cartSidebar.classList.add('open');
}
function closeCart() {
    cartSidebar.classList.remove('open');
}

// checkout simple alert
function checkoutAction() {
    if (cart.length === 0) {
        alert("Your cart is empty! Add some delicious items.");
    } else {
        const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
        alert(`✅ Order placed! Total items: ${totalItems}\nTotal amount: ${cartTotalSpan.innerText}\nThank you for ordering from QuickBite! 🚴‍♂️`);
        // clear cart after order (beginner style)
        cart = [];
        updateCartUI();
        renderFoodGrid();
        closeCart();
    }
}

// ---------- EVENT LISTENERS & INITIALIZATION ----------
function init() {
    renderFoodGrid();
    setupCategoryFilters();
    updateCartUI();

    // cart icon
    const cartIcon = document.getElementById("cartIconBtn");
    cartIcon.addEventListener("click", openCart);
    const closeBtn = document.getElementById("closeCartBtn");
    closeBtn.addEventListener("click", closeCart);
    // optional: click outside to close? not needed for simplicity

    searchBtn.addEventListener("click", handleSearch);
    searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    });

    const checkoutBtn = document.getElementById("checkoutBtn");
    checkoutBtn.addEventListener("click", checkoutAction);
}

// start everything
init();