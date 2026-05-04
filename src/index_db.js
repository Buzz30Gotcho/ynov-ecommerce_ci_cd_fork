const express = require('express');
require('dotenv').config();
const { initDatabase, initializeTables, closeDatabase } = require('./db/database');
const productsRouter = require('./routes/products_db');
const ordersRouter = require('./routes/orders_db');
const usersRouter = require('./routes/users_db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes with DB
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Initialize app with DB
async function startApp() {
    try {
        const dbPath = process.env.NODE_ENV === 'test' ? ':memory:' : './data.db';
        await initDatabase(dbPath);
        await initializeTables();

        if (require.main === module) {
            app.listen(PORT, () => {
                // server started
            });
        }
    } catch (err) {
        console.error('Failed to start app:', err);
        process.exit(1);
    }
}

// Only start the server if this is the main module
if (require.main === module) {
    startApp();

    // Graceful shutdown
    process.on('SIGINT', async () => {
        await closeDatabase();
        process.exit(0);
    });
}

module.exports = { app, startApp };
