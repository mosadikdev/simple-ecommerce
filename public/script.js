let cart = JSON.parse(localStorage.getItem('cart')) || [];

const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const checkoutModal = document.getElementById('checkout-modal');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutForm = document.getElementById('checkout-form');

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        description: "High-quality wireless headphones with noise cancellation"
    },
    {
        id: 2,
        name: "Smartphone",
        price: 699.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        description: "Latest smartphone with advanced features"
    },
    {
        id: 3,
        name: "Laptop",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        description: "Powerful laptop for work and gaming"
    },
    {
        id: 4,
        name: "Smart Watch",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        description: "Feature-rich smartwatch with health monitoring"
    },
    {
        id: 5,
        name: "Camera",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
        description: "Professional DSLR camera for photography"
    },
    {
        id: 6,
        name: "Gaming Console",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
        description: "Next-gen gaming console with 4K support"
    }
];

function init() {
    displayProducts();
    updateCart();
    setupEventListeners();
}

function displayProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">$${product.price}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
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
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, change) {
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
    localStorage.setItem('cart', JSON.stringify(cart));
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price} x ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
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
        closeBtn.addEventListener('click', () => {
            cartModal.style.display = 'none';
            checkoutModal.style.display = 'none';
        });
    });
    
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        processOrder();
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (e.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });
}

function processOrder() {
    const orderData = {
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString()
    };
    
    console.log('Order placed:', orderData);
    
    alert(`Order placed successfully! Total: $${orderData.total.toFixed(2)}`);
    
    cart = [];
    updateCart();
    checkoutModal.style.display = 'none';
    checkoutForm.reset();
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
        animation: slideIn 0.3s ease;
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

document.addEventListener('DOMContentLoaded', init);