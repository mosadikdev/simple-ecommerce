const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const USERS_FILE = path.join(__dirname, 'users.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

function readJSONFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return [];
    }
}

function writeJSONFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
        return false;
    }
}

function initializeDataFiles() {
    if (!fs.existsSync(USERS_FILE)) {
        writeJSONFile(USERS_FILE, []);
    }
    if (!fs.existsSync(ORDERS_FILE)) {
        writeJSONFile(ORDERS_FILE, []);
    }
    if (!fs.existsSync(PRODUCTS_FILE)) {
        const initialProducts = [
            {
                id: 1,
                name: "Wireless Headphones",
                price: 99.99,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
                description: "High-quality wireless headphones with noise cancellation",
                category: "audio",
                rating: 4.5,
                reviews: 128,
                stock: 15
            },
            {
                id: 2,
                name: "Smartphone",
                price: 699.99,
                image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
                description: "Latest smartphone with advanced features",
                category: "electronics",
                rating: 4.8,
                reviews: 256,
                stock: 10
            },
            {
                id: 3,
                name: "Laptop",
                price: 1299.99,
                image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
                description: "Powerful laptop for work and gaming",
                category: "computers",
                rating: 4.6,
                reviews: 89,
                stock: 8
            },
            {
                id: 4,
                name: "Smart Watch",
                price: 199.99,
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
                description: "Feature-rich smartwatch with health monitoring",
                category: "electronics",
                rating: 4.3,
                reviews: 167,
                stock: 20
            },
            {
                id: 5,
                name: "Camera",
                price: 599.99,
                image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
                description: "Professional DSLR camera for photography",
                category: "electronics",
                rating: 4.7,
                reviews: 74,
                stock: 12
            },
            {
                id: 6,
                name: "Gaming Console",
                price: 499.99,
                image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
                description: "Next-gen gaming console with 4K support",
                category: "gaming",
                rating: 4.9,
                reviews: 203,
                stock: 6
            },
            {
                id: 7,
                name: "Tablet",
                price: 399.99,
                image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
                description: "Versatile tablet for work and entertainment",
                category: "electronics",
                rating: 4.4,
                reviews: 95,
                stock: 14
            },
            {
                id: 8,
                name: "Gaming Mouse",
                price: 79.99,
                image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
                description: "High-precision gaming mouse with RGB lighting",
                category: "gaming",
                rating: 4.2,
                reviews: 156,
                stock: 25
            }
        ];
        writeJSONFile(PRODUCTS_FILE, initialProducts);
    }
}

app.get('/api/products', (req, res) => {
    try {
        const products = readJSONFile(PRODUCTS_FILE);
        console.log(`📦 Sending ${products.length} products`);
        res.json(products);
    } catch (error) {
        console.error('❌ Error reading products:', error);
        res.status(500).json({ error: 'Failed to load products' });
    }
});

app.post('/api/register', (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const usersData = readJSONFile(USERS_FILE);
        
        if (usersData.find(user => user.email === email)) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }
        
        const newUser = {
            id: Date.now(),
            name,
            email,
            password, 
            createdAt: new Date().toISOString(),
            orders: []
        };
        
        usersData.push(newUser);
        const success = writeJSONFile(USERS_FILE, usersData);
        
        if (success) {
            console.log(`✅ New user registered: ${email}`);
            res.json({ 
                success: true, 
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    createdAt: newUser.createdAt,
                    orders: newUser.orders
                } 
            });
        } else {
            res.status(500).json({ error: 'Failed to save user data' });
        }
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const usersData = readJSONFile(USERS_FILE);
        const user = usersData.find(u => u.email === email && u.password === password);
        
        if (user) {
            console.log(`✅ User logged in: ${email}`);
            res.json({ 
                success: true, 
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    orders: user.orders
                }
            });
        } else {
            console.log(`❌ Failed login attempt for: ${email}`);
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/orders', (req, res) => {
    try {
        const { userId, orderData } = req.body;
        
        if (!userId || !orderData) {
            return res.status(400).json({ error: 'User ID and order data are required' });
        }

        const usersData = readJSONFile(USERS_FILE);
        const ordersData = readJSONFile(ORDERS_FILE);
        
        const user = usersData.find(u => u.id === parseInt(userId));
        if (user) {
            user.orders.push(orderData);
            
            ordersData.push({
                ...orderData,
                userId: parseInt(userId),
                userEmail: user.email
            });
            
            const userSuccess = writeJSONFile(USERS_FILE, usersData);
            const orderSuccess = writeJSONFile(ORDERS_FILE, ordersData);
            
            if (userSuccess && orderSuccess) {
                console.log(`✅ New order placed: ${orderData.id} for user: ${user.email}`);
                res.json({ 
                    success: true, 
                    orderId: orderData.id,
                    message: 'Order placed successfully'
                });
            } else {
                res.status(500).json({ error: 'Failed to save order data' });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('❌ Order processing error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/users/:userId/orders', (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const usersData = readJSONFile(USERS_FILE);
        
        const user = usersData.find(u => u.id === userId);
        if (user) {
            console.log(`📋 Sending ${user.orders.length} orders for user: ${user.email}`);
            res.json(user.orders);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('❌ Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to load orders' });
    }
});

app.post('/api/admin/products', (req, res) => {
    try {
        const product = req.body;
        const products = readJSONFile(PRODUCTS_FILE);
        
        product.id = Date.now();
        products.push(product);
        
        const success = writeJSONFile(PRODUCTS_FILE, products);
        if (success) {
            console.log(`✅ New product added: ${product.name}`);
            res.json({ success: true, product });
        } else {
            res.status(500).json({ error: 'Failed to add product' });
        }
    } catch (error) {
        console.error('❌ Error adding product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/admin/stats', (req, res) => {
    try {
        const usersData = readJSONFile(USERS_FILE);
        const ordersData = readJSONFile(ORDERS_FILE);
        const products = readJSONFile(PRODUCTS_FILE);
        
        const stats = {
            totalUsers: usersData.length,
            totalOrders: ordersData.length,
            totalProducts: products.length,
            totalRevenue: ordersData.reduce((sum, order) => sum + order.total, 0)
        };
        
        res.json(stats);
    } catch (error) {
        console.error('❌ Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to load statistics' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

initializeDataFiles();

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Visit: http://localhost:${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   GET  /api/products`);
    console.log(`   POST /api/register`);
    console.log(`   POST /api/login`);
    console.log(`   POST /api/orders`);
    console.log(`   GET  /api/users/:userId/orders`);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});