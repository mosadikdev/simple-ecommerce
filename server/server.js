const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.get('/api/products', (req, res) => {
    const products = [
        {
            id: 1,
            name: "Wireless Headphones",
            price: 99.99,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            description: "High-quality wireless headphones with noise cancellation"
        },
        // ... same products as in frontend
    ];
    res.json(products);
});

app.post('/api/orders', (req, res) => {
    // In a real application, you would save to a database
    console.log('Order received:', req.body);
    res.json({ 
        success: true, 
        message: 'Order placed successfully',
        orderId: 'ORD_' + Date.now()
    });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});