let cart = [];
let currentUser = null;
let users = [];

function initializeData() {
    try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            const parsedCart = JSON.parse(cartData);
            if (Array.isArray(parsedCart)) {
                cart = parsedCart;
            } else {
                console.warn('Cart data is corrupted, resetting to empty array');
                localStorage.removeItem('cart');
            }
        }
    } catch (error) {
        console.error('Error loading cart data:', error);
        cart = [];
    }

    try {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            currentUser = JSON.parse(userData);
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        currentUser = null;
    }

    try {
        const usersData = localStorage.getItem('users');
        if (usersData) {
            const parsedUsers = JSON.parse(usersData);
            if (Array.isArray(parsedUsers)) {
                users = parsedUsers;
            }
        }
    } catch (error) {
        console.error('Error loading users data:', error);
        users = [];
    }
}

const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const checkoutModal = document.getElementById('checkout-modal');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutForm = document.getElementById('checkout-form');

const authModal = document.getElementById('auth-modal');
const userBtn = document.getElementById('user-btn');
const userDropdown = document.getElementById('user-dropdown');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authTabs = document.querySelectorAll('.auth-tab');
const ordersLink = document.getElementById('orders-link');
const logoutLink = document.getElementById('logout-link');

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        description: "High-quality wireless headphones with noise cancellation",
        category: "audio",
        rating: 4.5,
        reviews: 128
    },
    {
        id: 2,
        name: "Smartphone",
        price: 699.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        description: "Latest smartphone with advanced features",
        category: "electronics",
        rating: 4.8,
        reviews: 256
    },
    {
        id: 3,
        name: "Laptop",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        description: "Powerful laptop for work and gaming",
        category: "computers",
        rating: 4.6,
        reviews: 89
    },
    {
        id: 4,
        name: "Smart Watch",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        description: "Feature-rich smartwatch with health monitoring",
        category: "electronics",
        rating: 4.3,
        reviews: 167
    },
    {
        id: 5,
        name: "Camera",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
        description: "Professional DSLR camera for photography",
        category: "electronics",
        rating: 4.7,
        reviews: 74
    },
    {
        id: 6,
        name: "Gaming Console",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
        description: "Next-gen gaming console with 4K support",
        category: "gaming",
        rating: 4.9,
        reviews: 203
    },
    {
        id: 7,
        name: "Tablet",
        price: 399.99,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
        description: "Versatile tablet for work and entertainment",
        category: "electronics",
        rating: 4.4,
        reviews: 95
    },
    {
        id: 8,
        name: "Gaming Mouse",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
        description: "High-precision gaming mouse with RGB lighting",
        category: "gaming",
        rating: 4.2,
        reviews: 156
    }
];

function init() {
    initializeData(); 
    displayProducts();
    updateCart();
    setupEventListeners();
    setupCategoryFilter();
    setupSearch();
    setupAuthSystem();
    updateUserUI();
}

function displayProducts() {
    if (!productsGrid) {
        console.error('Products grid element not found');
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="showProductDetails(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-badge">${product.category}</div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-rating">
                ${generateStarRating(product.rating)}
                <span class="rating-text">(${product.reviews})</span>
            </div>
            <div class="product-price">$${product.price}</div>
            <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    if (!Array.isArray(cart)) {
        console.warn('Cart is not an array, resetting...');
        cart = [];
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    if (!Array.isArray(cart)) {
        cart = [];
    }
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, change) {
    if (!Array.isArray(cart)) {
        cart = [];
        updateCart();
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    if (!Array.isArray(cart)) {
        console.warn('Cart is not an array, resetting...');
        cart = [];
    }

    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
    
    const totalItems = cart.reduce((sum, item) => {
        const quantity = Number(item.quantity) || 0;
        return sum + quantity;
    }, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    const total = cart.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        return sum + (price * quantity);
    }, 0);
    
    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2);
    }
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name || 'Unknown Product'}</h4>
                        <p>$${(Number(item.price) || 0).toFixed(2)} x ${Number(item.quantity) || 0}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${Number(item.quantity) || 0}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

function setupEventListeners() {
    cartBtn.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });
    
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'block';
    });
    
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        processOrder();
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

async function processOrder() {
    if (!currentUser) {
        alert('Please login to complete your order!');
        authModal.style.display = 'block';
        return;
    }

    const orderData = {
        id: 'ORD_' + Date.now(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toISOString(),
        status: 'completed'
    };
    
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                userId: currentUser.id, 
                orderData 
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser.orders.push(orderData);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showNotification(`Order #${orderData.id} placed successfully! Total: $${orderData.total.toFixed(2)}`);
            sendOrderConfirmation(orderData);
            
            cart = [];
            updateCart();
            checkoutModal.style.display = 'none';
            checkoutForm.reset();
        } else {
            alert(data.error || 'Order failed');
        }
    } catch (error) {
        console.error('Order error:', error);
        alert('Network error. Please try again.');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 3000;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Scroll to products section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

// Category filter system
function setupCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            filterProducts(category);
        });
    });
}

function filterProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    displayFilteredProducts(filteredProducts);
}

function displayFilteredProducts(filteredProducts) {
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="showProductDetails(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-badge">${product.category}</div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-rating">
                ${generateStarRating(product.rating)}
                <span class="rating-text">(${product.reviews})</span>
            </div>
            <div class="product-price">$${product.price}</div>
            <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
            displayFilteredProducts(filteredProducts);
        } else {
            displayProducts();
        }
    };
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('product-modal');
    const content = document.getElementById('product-details-content');
    
    content.innerHTML = `
        <div class="product-details-content">
            <div>
                <img src="${product.image}" alt="${product.name}" class="product-details-image">
            </div>
            <div class="product-details-info">
                <h2>${product.name}</h2>
                <div class="product-rating">
                    ${generateStarRating(product.rating)}
                    <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                </div>
                <div class="product-details-price">$${product.price}</div>
                <p class="product-details-description">${product.description}</p>
                <div class="product-details-meta">
                    <span><strong>Category:</strong> ${product.category}</span>
                    <span><strong>SKU:</strong> PROD-${product.id.toString().padStart(3, '0')}</span>
                </div>
                <button class="add-to-cart large" onclick="addToCart(${product.id}); closeProductModal()">
                    Add to Cart - $${product.price}
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function updateUserUI() {
    if (currentUser) {
        userBtn.innerHTML = `👤 ${currentUser.name.split(' ')[0]}`;
        userBtn.style.background = '#27ae60';
    } else {
        userBtn.innerHTML = '👤 Account';
        userBtn.style.background = '#3498db';
    }
}

function setupAuthSystem() {
    userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentUser) {
            userDropdown.classList.toggle('show');
        } else {
            authModal.style.display = 'block';
        }
    });

    document.addEventListener('click', () => {
        userDropdown.classList.remove('show');
    });

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            document.getElementById(`${targetTab}-form`).classList.add('active');
        });
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = loginForm.querySelectorAll('input');
        const email = inputs[0].value;
        const password = inputs[1].value;
        
        loginUser(email, password);
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = registerForm.querySelectorAll('input');
        const name = inputs[0].value;
        const email = inputs[1].value;
        const password = inputs[2].value;
        const confirmPassword = inputs[3].value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        registerUser(name, email, password);
    });

    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logoutUser();
    });

    ordersLink.addEventListener('click', (e) => {
        e.preventDefault();
        showOrdersHistory();
    });
}

async function registerUser(name, email, password) {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            updateUserUI();
            authModal.style.display = 'none';
            registerForm.reset();
            
            showNotification(`Welcome ${name}! Account created successfully.`);
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Network error. Please try again.');
    }
}

async function loginUser(email, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            updateUserUI();
            authModal.style.display = 'none';
            loginForm.reset();
            
            showNotification(`Welcome back, ${data.user.name.split(' ')[0]}!`);
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Network error. Please try again.');
    }
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    updateUserUI();
    userDropdown.classList.remove('show');
    
    showNotification('Logged out successfully.');
}

function showOrdersHistory() {
    if (!currentUser) {
        alert('Please login to view your orders!');
        authModal.style.display = 'block';
        return;
    }
    
    const ordersModal = document.getElementById('orders-modal');
    const ordersList = document.getElementById('orders-list');
    
    if (currentUser.orders.length === 0) {
        ordersList.innerHTML = `
            <div class="no-orders">
                <h3>No Orders Yet</h3>
                <p>You haven't placed any orders yet.</p>
                <button class="cta-button" onclick="document.getElementById('orders-modal').style.display='none'; document.getElementById('products').scrollIntoView()">Start Shopping</button>
            </div>
        `;
    } else {
        ordersList.innerHTML = currentUser.orders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.id}</div>
                        <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
                    </div>
                    <div class="order-total">$${order.total.toFixed(2)}</div>
                </div>
                <div class="order-status status-completed">${order.status}</div>
                <div class="order-products">
                    ${order.items.map(item => `
                        <div class="order-product">
                            <div class="product-info">
                                <strong>${item.name}</strong>
                                <div class="product-quantity">Qty: ${item.quantity} × $${item.price}</div>
                            </div>
                            <div class="product-total">$${(item.quantity * item.price).toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
    
    ordersModal.style.display = 'block';
}

function sendOrderConfirmation(order) {
    console.log('Sending confirmation email for order:', order.id);
    
    setTimeout(() => {
        if (currentUser) {
            showNotification(`Order confirmation sent to ${currentUser.email}`);
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', init);