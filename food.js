const menuItems = [
    {
        id: 1,
        name: "Margherita Pizza",
        category: "pizza",
        price: 12.99,
        img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        desc: "Classic pizza with tomato sauce, mozzarella, and basil"
    },
    {
        id: 2,
        name: "Pepperoni Pizza",
        category: "pizza",
        price: 14.99,
        img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        desc: "Pizza with tomato sauce, mozzarella, and pepperoni"
    },
    {
        id: 3,
        name: "Veggie Burger",
        category: "burger",
        price: 9.99,
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        desc: "Vegetarian burger with fresh vegetables and special sauce"
    },
    {
        id: 4,
        name: "Cheeseburger",
        category: "burger",
        price: 10.99,
        img: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        desc: "Classic beef burger with cheese, lettuce, and tomato"
    },
    {
        id: 5,
        name: "Spaghetti Carbonara",
        category: "pasta",
        price: 11.99,
        img: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        desc: "Pasta with eggs, cheese, pancetta, and black pepper"
    },
    {
        id: 6,
        name: "Penne Arrabiata",
        category: "pasta",
        price: 10.99,
        img: "https://images.unsplash.com/photo-1611270629569-8b357cb88da9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        desc: "Penne pasta with spicy tomato sauce"
    },
    {
        id: 7,
        name: "Caesar Salad",
        category: "salad",
        price: 8.99,
        img: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        desc: "Romaine lettuce with croutons, parmesan, and Caesar dressing"
    },
    {
        id: 8,
        name: "Greek Salad",
        category: "salad",
        price: 9.99,
        img: "https://images.unsplash.com/photo-1607532941433-304659e8198a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        desc: "Fresh vegetables with feta cheese and olives"
    },
    {
        id: 9,
        name: "Tiramisu",
        category: "dessert",
        price: 6.99,
        img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        desc: "Classic Italian dessert with coffee-soaked ladyfingers"
    },
    {
        id: 10,
        name: "Chocolate Lava Cake",
        category: "dessert",
        price: 7.99,
        img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        desc: "Warm chocolate cake with a molten center"
    }
];

// DOM Elements
const menuContainer = document.querySelector('.menu-items');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartBtn = document.querySelector('.cart-icon');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.total-price');
const cartCount = document.querySelector('.cart-count');
const checkoutBtn = document.querySelector('.checkout-btn');

// Cart
let cart = [];

// Display Menu Items
function displayMenuItems(menuItems) {
    let displayMenu = menuItems.map(item => {
        return `
        <div class="menu-item" data-id="${item.id}" data-category="${item.category}">
            <img src="${item.img}" alt="${item.name}">
            <div class="menu-item-info">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <span class="price">$${item.price.toFixed(2)}</span>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
        `;
    });
    displayMenu = displayMenu.join('');
    menuContainer.innerHTML = displayMenu;
    
    // Add event listeners to all add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
}

// Filter Menu Items
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        if (category === 'all') {
            displayMenuItems(menuItems);
        } else {
            const filteredItems = menuItems.filter(item => item.category === category);
            displayMenuItems(filteredItems);
        }
    });
});

// Add to Cart
function addToCart(e) {
    const menuItem = e.target.closest('.menu-item');
    const id = menuItem.dataset.id;
    const selectedItem = menuItems.find(item => item.id === parseInt(id));
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === selectedItem.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        selectedItem.quantity = 1;
        cart.push(selectedItem);
    }
    
    updateCart();
    
    // Animation for adding to cart
    const cartIcon = document.querySelector('.cart-icon i');
    cartIcon.classList.add('animate');
    setTimeout(() => {
        cartIcon.classList.remove('animate');
    }, 500);
}

// Update Cart
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items display
    renderCartItems();
    
    // Update total price
    updateTotal();
}

// Render Cart Items
function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => {
        return `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="price">$${item.price.toFixed(2)}</span>
            </div>
            <div class="cart-item-quantity">
                <button class="decrease-btn"><i class="fas fa-minus"></i></button>
                <span>${item.quantity}</span>
                <button class="increase-btn"><i class="fas fa-plus"></i></button>
            </div>
            <i class="fas fa-trash remove-item"></i>
        </div>
        `;
    }).join('');
    
    // Add event listeners to quantity buttons
    const decreaseBtns = document.querySelectorAll('.decrease-btn');
    const increaseBtns = document.querySelectorAll('.increase-btn');
    const removeBtns = document.querySelectorAll('.remove-item');
    
    decreaseBtns.forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });
    
    increaseBtns.forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });
    
    removeBtns.forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
}

// Update Total Price
function updateTotal() {
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Decrease Quantity
function decreaseQuantity(e) {
    const cartItem = e.target.closest('.cart-item');
    const id = cartItem.dataset.id;
    const item = cart.find(item => item.id === parseInt(id));
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== parseInt(id));
    }
    
    updateCart();
}

// Increase Quantity
function increaseQuantity(e) {
    const cartItem = e.target.closest('.cart-item');
    const id = cartItem.dataset.id;
    const item = cart.find(item => item.id === parseInt(id));
    
    item.quantity += 1;
    updateCart();
}

// Remove Item
function removeItem(e) {
    const cartItem = e.target.closest('.cart-item');
    const id = cartItem.dataset.id;
    
    cart = cart.filter(item => item.id !== parseInt(id));
    updateCart();
}

// Checkout
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert(`Order placed! Total: $${cartTotal.textContent}`);
    cart = [];
    updateCart();
    closeCartModal();
});

// Open Cart Modal
cartBtn.addEventListener('click', openCartModal);

// Close Cart Modal
closeCart.addEventListener('click', closeCartModal);

// Close when clicking outside modal
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        closeCartModal();
    }
});
