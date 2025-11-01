let cart = [];
let currentUser = null;
let users = [];

let coupons = JSON.parse(localStorage.getItem('coupons')) || [];
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
let adminUsers = JSON.parse(localStorage.getItem('adminUsers')) || [{ email: 'admin@store.com', password: 'admin123' }];
let currentCoupon = null;

const adminModal = document.getElementById('admin-modal');
const adminTabs = document.querySelectorAll('.admin-tab');
const addProductModal = document.getElementById('add-product-modal');
const addProductForm = document.getElementById('add-product-form');
const addCouponModal = document.getElementById('add-coupon-modal');
const addCouponForm = document.getElementById('add-coupon-form');
const reviewsModal = document.getElementById('reviews-modal');
const reviewsList = document.getElementById('reviews-list');
const addReviewForm = document.getElementById('add-review-form');
const reviewStars = document.getElementById('review-stars');
const reviewRating = document.getElementById('review-rating');


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



function createDefaultAdmin() {
    const adminUser = {
        id: 1, 
        name: 'Store Administrator',
        email: 'admin@store.com',
        password: 'admin123', 
        createdAt: new Date().toISOString(),
        orders: [],
        role: 'admin' 
    };

    const existingAdmin = users.find(user => user.email === 'admin@store.com');
    if (!existingAdmin) {
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('✅ Default admin account created');
    }
}

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
                createDefaultAdmin();
            }
        } else {
            users = [];
            createDefaultAdmin();
        }
    } catch (error) {
        console.error('Error loading users data:', error);
        users = [];
        createDefaultAdmin();
    }
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

    if (!currentUser) {
        if (confirm('You need to login to add items to cart. Would you like to login now?')) {
            window.location.href = 'login.html';
        }
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

function validateOrderData(orderData) {
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
        throw new Error('Invalid order items');
    }
    
    if (!orderData.total || orderData.total <= 0) {
        throw new Error('Invalid order total');
    }
    
    return true;
}

async function processOrder() {
    if (!currentUser) {
        if (confirm('You need to login to complete your order. Would you like to login now?')) {
            window.location.href = 'login.html';
        }
        return;
    }

    try {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const orderData = {
            id: 'ORD_' + Date.now(),
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: new Date().toISOString(),
            status: 'completed'
        };

        validateOrderData(orderData);

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
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
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
            alert(data.error || 'Order failed. Please try again.');
        }
    } catch (error) {
        console.error('Order processing error:', error);
        alert('There was a problem processing your order. Please try again.');
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

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

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
    const guestMenu = document.getElementById('guest-menu');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    const adminBtn = document.getElementById('admin-btn');
    const cartBtn = document.getElementById('cart-btn');

    if (currentUser) {
        if (guestMenu) guestMenu.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (userName) userName.textContent = currentUser.name.split(' ')[0];
        
        if (userBtn) {
            userBtn.innerHTML = `👤 ${currentUser.name.split(' ')[0]}`;
            userBtn.style.background = '#27ae60';
        }

        if (cartBtn) cartBtn.style.display = 'block';

        if (adminBtn) {
            if (isAdmin(currentUser)) {
                adminBtn.style.display = 'block';
                console.log('🔧 Admin button shown for:', currentUser.email);
            } else {
                adminBtn.style.display = 'none';
            }
        }

    } else {
        if (guestMenu) guestMenu.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
        
        if (adminBtn) adminBtn.style.display = 'none';
        if (cartBtn) cartBtn.style.display = 'none';
        
        if (userBtn) {
            userBtn.innerHTML = '👤 Account';
            userBtn.style.background = '#3498db';
        }

        if (currentUser && isAdmin(currentUser)) {
        const adminIndicator = document.getElementById('admin-indicator');
        if (!adminIndicator) {
            const indicator = document.createElement('div');
            indicator.id = 'admin-indicator';
            indicator.style.cssText = `
                background: #9b59b6;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 10px;
                font-size: 0.7rem;
                font-weight: bold;
                margin-left: 0.5rem;
            `;
            indicator.textContent = 'ADMIN';
            
            if (userBtn) {
                userBtn.appendChild(indicator);
            }
        }
    } else {
        const adminIndicator = document.getElementById('admin-indicator');
        if (adminIndicator) {
            adminIndicator.remove();
        }
    }
    }
}

function isAdmin(user) {
    return user && user.email === 'admin@store.com';
}

function setupAuthSystem() {
    if (userBtn) {
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentUser) {
                userDropdown.classList.toggle('show');
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    document.addEventListener('click', () => {
        if (userDropdown) userDropdown.classList.remove('show');
    });

    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }

    if (ordersLink) {
        ordersLink.addEventListener('click', (e) => {
            e.preventDefault();
            showOrdersHistory();
        });
    }
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    updateUserUI();
    if (userDropdown) userDropdown.classList.remove('show');
    
    showNotification('Logged out successfully.');
    
    setTimeout(() => {
        window.location.reload();
    }, 1000);
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








function setupAdminPanel() {
    console.log('🔧 Setting up admin panel...');
    
    const adminBtn = document.getElementById('admin-btn');
    
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            console.log('🎯 Admin button clicked!');
            showAdminLogin();
        });
    }

    if (adminTabs && adminTabs.length > 0) {
        adminTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                adminTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                document.querySelectorAll('.admin-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                const targetContent = document.getElementById(`admin-${targetTab}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                if (targetTab === 'products') loadProductsAdmin();
                if (targetTab === 'orders') loadOrdersAdmin();
                if (targetTab === 'coupons') loadCouponsAdmin();
                if (targetTab === 'analytics') loadAnalytics();
            });
        });
    }

    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewProduct();
    });

    addCouponForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewCoupon();
    });

    if (reviewStars) {
        const stars = reviewStars.querySelectorAll('span');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                setStarRating(rating);
            });
        });
    }

    if (addReviewForm) {
        addReviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewReview();
        });
    }
}

function showAdminLogin() {
    console.log('🔐 Checking admin access...');
    
    if (currentUser && isAdmin(currentUser)) {
        console.log('✅ Current user is admin, showing admin panel');
        adminModal.style.display = 'block';
        loadProductsAdmin();
        return;
    }

    if (currentUser) {
        const proceed = confirm('You are logged in as a regular user. Do you want to login as admin?');
        if (!proceed) return;
    }

    const email = prompt('Admin Email:');
    if (!email) return;

    const password = prompt('Admin Password:');
    if (!password) return;

    console.log('📧 Admin login attempt:', email);
    
    const adminUser = users.find(u => u.email === email && u.password === password);
    
    if (adminUser && isAdmin(adminUser)) {
        console.log('✅ Admin login successful');
        
        currentUser = adminUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        updateUserUI();
        
        adminModal.style.display = 'block';
        loadProductsAdmin();
        
        showNotification(`Welcome Admin! ${adminUser.name}`);
    } else {
        console.log('❌ Admin login failed');
        alert('Invalid admin credentials!\n\nDefault admin account:\nEmail: admin@store.com\nPassword: admin123');
    }
}

function validateRegistration(email) {
    if (email === 'admin@store.com') {
        showError('This email address is reserved for administration.');
        return false;
    }
    return true;
}

function loadProductsAdmin() {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = products.map(product => `
        <div class="admin-item">
            <div class="admin-item-header">
                <div>
                    <h4>${product.name}</h4>
                    <div class="stock-info ${product.stock < 10 ? 'stock-low' : 'stock-available'}">
                        Stock: ${product.stock} | Price: $${product.price}
                    </div>
                </div>
                <div class="admin-actions">
                    <button class="btn-success" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </div>
            <p>${product.description}</p>
        </div>
    `).join('');
}

function showAddProductForm() {
    addProductModal.style.display = 'block';
}

function addNewProduct() {
    const formData = new FormData(addProductForm);
    const newProduct = {
        id: Date.now(),
        name: formData.get('name'),
        price: parseFloat(formData.get('price')),
        image: formData.get('image'),
        description: formData.get('description'),
        category: formData.get('category'),
        rating: parseFloat(formData.get('rating')) || 4.0,
        reviews: 0,
        stock: parseInt(formData.get('stock'))
    };

    products.push(newProduct);
    addProductModal.style.display = 'none';
    addProductForm.reset();
    loadProductsAdmin();
    displayProducts(); 
    
    showNotification('Product added successfully!');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        loadProductsAdmin();
        displayProducts();
        showNotification('Product deleted successfully!');
    }
}

function loadOrdersAdmin() {
    const ordersList = document.getElementById('orders-admin-list');
    const allOrders = getAllOrders();
    
    if (allOrders.length === 0) {
        ordersList.innerHTML = '<p>No orders found.</p>';
        return;
    }

    ordersList.innerHTML = allOrders.map(order => `
        <div class="admin-item">
            <div class="admin-item-header">
                <div>
                    <h4>Order #${order.id}</h4>
                    <div>Customer: ${order.userEmail || 'Unknown'} | Date: ${new Date(order.date).toLocaleDateString()}</div>
                </div>
                <div class="admin-actions">
                    <span class="order-status status-completed">${order.status}</span>
                    <button class="btn-success" onclick="updateOrderStatus('${order.id}', 'completed')">Complete</button>
                    <button class="btn-danger" onclick="updateOrderStatus('${order.id}', 'cancelled')">Cancel</button>
                </div>
            </div>
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
            <div class="order-total">Total: $${order.total.toFixed(2)}</div>
        </div>
    `).join('');
}

function getAllOrders() {
    const allOrders = [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    users.forEach(user => {
        user.orders.forEach(order => {
            allOrders.push({
                ...order,
                userEmail: user.email
            });
        });
    });
    
    return allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function loadCouponsAdmin() {
    const couponsList = document.getElementById('coupons-list');
    couponsList.innerHTML = coupons.map(coupon => `
        <div class="admin-item">
            <div class="admin-item-header">
                <div>
                    <h4>${coupon.code} - ${coupon.discount}% OFF</h4>
                    <div>Expires: ${new Date(coupon.expires).toLocaleDateString()} | Uses: ${coupon.used || 0}/${coupon.maxUses || 'Unlimited'}</div>
                </div>
                <div class="admin-actions">
                    <button class="btn-danger" onclick="deleteCoupon('${coupon.code}')">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function showAddCouponForm() {
    addCouponModal.style.display = 'block';
}

function addNewCoupon() {
    const formData = new FormData(addCouponForm);
    const newCoupon = {
        code: formData.get('code').toUpperCase(),
        discount: parseInt(formData.get('discount')),
        expires: formData.get('expires'),
        maxUses: parseInt(formData.get('maxUses')) || null,
        used: 0
    };

    coupons.push(newCoupon);
    localStorage.setItem('coupons', JSON.stringify(coupons));
    addCouponModal.style.display = 'none';
    addCouponForm.reset();
    loadCouponsAdmin();
    
    showNotification('Coupon added successfully!');
}

function deleteCoupon(code) {
    if (confirm('Are you sure you want to delete this coupon?')) {
        coupons = coupons.filter(c => c.code !== code);
        localStorage.setItem('coupons', JSON.stringify(coupons));
        loadCouponsAdmin();
        showNotification('Coupon deleted successfully!');
    }
}

function showProductReviews(productId) {
    const product = products.find(p => p.id === productId);
    const productReviews = reviews.filter(r => r.productId === productId);
    
    reviewsList.innerHTML = `
        <h3>Reviews for ${product.name}</h3>
        ${productReviews.length === 0 ? '<p>No reviews yet. Be the first to review!</p>' : ''}
        ${productReviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-author">${review.userName}</div>
                    <div class="review-date">${new Date(review.date).toLocaleDateString()}</div>
                </div>
                <div class="product-rating">${generateStarRating(review.rating)}</div>
                <div class="review-comment">${review.comment}</div>
            </div>
        `).join('')}
    `;
    
    reviewsModal.style.display = 'block';
    currentReviewProduct = productId;
}

function setStarRating(rating) {
    const stars = reviewStars.querySelectorAll('span');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
            star.textContent = '★';
        } else {
            star.classList.remove('active');
            star.textContent = '☆';
        }
    });
    reviewRating.value = rating;
}

function addNewReview() {
    if (!currentUser) {
        alert('Please login to add a review!');
        authModal.style.display = 'block';
        return;
    }

    const formData = new FormData(addReviewForm);
    const newReview = {
        id: Date.now(),
        productId: currentReviewProduct,
        userId: currentUser.id,
        userName: currentUser.name,
        rating: parseInt(formData.get('rating')),
        comment: formData.get('comment'),
        date: new Date().toISOString()
    };

    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    updateProductRating(currentReviewProduct);
    
    reviewsModal.style.display = 'none';
    addReviewForm.reset();
    showNotification('Review added successfully!');
}

function updateProductRating(productId) {
    const productReviews = reviews.filter(r => r.productId === productId);
    if (productReviews.length > 0) {
        const averageRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length;
        const product = products.find(p => p.id === productId);
        product.rating = parseFloat(averageRating.toFixed(1));
        product.reviews = productReviews.length;
    }
}

function loadAnalytics() {
    const allOrders = getAllOrders();
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    const totalUsers = users.length;

    document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('total-orders').textContent = allOrders.length;
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-users').textContent = totalUsers;
}

function setupCouponSystem() {
    const couponSection = document.createElement('div');
    couponSection.className = 'coupon-section';
    couponSection.innerHTML = `
        <h4>Apply Coupon</h4>
        <div class="coupon-input">
            <input type="text" id="coupon-code" placeholder="Enter coupon code">
            <button class="btn-primary" onclick="applyCoupon()">Apply</button>
        </div>
        <div id="coupon-message"></div>
    `;
    
    cartTotal.parentNode.insertBefore(couponSection, cartTotal);
}

function applyCoupon() {
    const code = document.getElementById('coupon-code').value.toUpperCase();
    const coupon = coupons.find(c => c.code === code);
    
    if (!coupon) {
        document.getElementById('coupon-message').innerHTML = '<span style="color: #e74c3c;">Invalid coupon code!</span>';
        return;
    }
    
    if (new Date(coupon.expires) < new Date()) {
        document.getElementById('coupon-message').innerHTML = '<span style="color: #e74c3c;">Coupon has expired!</span>';
        return;
    }
    
    if (coupon.maxUses && coupon.used >= coupon.maxUses) {
        document.getElementById('coupon-message').innerHTML = '<span style="color: #e74c3c;">Coupon usage limit reached!</span>';
        return;
    }
    
    currentCoupon = coupon;
    updateCartWithCoupon();
    document.getElementById('coupon-message').innerHTML = `<span style="color: #27ae60;">Coupon applied! ${coupon.discount}% discount.</span>`;
}

function updateCartWithCoupon() {
    if (!currentCoupon) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = (total * currentCoupon.discount) / 100;
    const finalTotal = total - discount;
    
    const discountElement = document.createElement('div');
    discountElement.className = 'cart-discount';
    discountElement.innerHTML = `Discount: -$${discount.toFixed(2)}`;
    
    const finalTotalElement = document.createElement('div');
    finalTotalElement.className = 'cart-final-total';
    finalTotalElement.innerHTML = `Final Total: $${finalTotal.toFixed(2)}`;
    
    document.querySelectorAll('.cart-discount, .cart-final-total').forEach(el => el.remove());
    
    cartTotal.parentNode.appendChild(discountElement);
    cartTotal.parentNode.appendChild(finalTotalElement);
}

function init() {
    initializeData(); 
    updateUserUI();   
    displayProducts();
    updateCart();
    setupEventListeners();
    setupCategoryFilter();
    setupSearch();
    setupAuthSystem();
    setupAdminPanel();
    setupCouponSystem();
    
    console.log('✅ Application initialized successfully');
    console.log('👤 Current user:', currentUser ? currentUser.email : 'Not logged in');
}

function addAdminButton() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && !document.getElementById('admin-btn')) {
        const adminBtn = document.createElement('button');
        adminBtn.id = 'admin-btn';
        adminBtn.className = 'admin-btn';
        adminBtn.textContent = '⚙️ Admin';
        navLinks.appendChild(adminBtn);
    }
}




document.addEventListener('DOMContentLoaded', init);