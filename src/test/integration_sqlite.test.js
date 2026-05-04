const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const { initDatabase, closeDatabase, runAsync, getAsync, allAsync, initializeTables } = require('../db/database');

let app;
let server;

// Avant tous les tests : créer l'app et la DB
before(async function () {
    this.timeout(10000);

    // Initialiser la DB en mémoire
    await initDatabase();
    await initializeTables();

    // Créer l'app Express simple
    app = express();
    app.use(express.json());

    // Routes produits
    app.get('/api/products', async (req, res) => {
        try {
            const products = await allAsync('SELECT * FROM products');
            res.json(products);
        } catch (err) {
            res.status(500).json({ error: 'Database error' });
        }
    });

    app.post('/api/products', async (req, res) => {
        try {
            const { name, price, stock, category } = req.body;
            if (!name || price === undefined) {
                return res.status(400).json({ error: 'name and price are required' });
            }
            const result = await runAsync(
                'INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)',
                [name, price, stock ?? 0, category ?? 'misc']
            );
            const product = await getAsync('SELECT * FROM products WHERE id = ?', [result.id]);
            res.status(201).json(product);
        } catch (err) {
            res.status(500).json({ error: 'Database error' });
        }
    });

    // Routes utilisateurs
    app.get('/api/users', async (req, res) => {
        try {
            const users = await allAsync('SELECT * FROM users');
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: 'Database error' });
        }
    });

    app.post('/api/users', async (req, res) => {
        try {
            const { name, email } = req.body;
            if (!name || !email) {
                return res.status(400).json({ error: 'name and email are required' });
            }
            const result = await runAsync(
                'INSERT INTO users (name, email, role) VALUES (?, ?, ?)',
                [name, email, 'customer']
            );
            const user = await getAsync('SELECT * FROM users WHERE id = ?', [result.id]);
            res.status(201).json(user);
        } catch (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            res.status(500).json({ error: 'Database error' });
        }
    });

    // Routes commandes
    app.post('/api/orders', async (req, res) => {
        try {
            const { userId, productIds } = req.body;
            if (!userId || !productIds || !Array.isArray(productIds)) {
                return res.status(400).json({ error: 'userId and productIds[] are required' });
            }
            const createdAt = new Date().toISOString().split('T')[0];
            const result = await runAsync(
                'INSERT INTO orders (userId, total, status, createdAt) VALUES (?, ?, ?, ?)',
                [userId, 0, 'pending', createdAt]
            );
            const order = await getAsync('SELECT * FROM orders WHERE id = ?', [result.id]);
            res.status(201).json(order);
        } catch (err) {
            res.status(500).json({ error: 'Database error' });
        }
    });

    app.patch('/api/orders/:id/status', async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const { status } = req.body;
            const order = await getAsync('SELECT * FROM orders WHERE id = ?', [id]);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
            }
            await runAsync('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
            const updated = await getAsync('SELECT * FROM orders WHERE id = ?', [id]);
            res.json(updated);
        } catch (err) {
            res.status(500).json({ error: 'Database error' });
        }
    });
});

// Après tous les tests : fermer la DB
after(async function () {
    this.timeout(5000);
    await closeDatabase();
});

describe('Integration Tests - SQLite', () => {
    describe('Products', () => {
        it('POST /api/products crée un produit', async () => {
            const res = await request(app)
                .post('/api/products')
                .send({ name: 'Laptop', price: 999.99, stock: 5 });

            expect(res.status).to.equal(201);
            expect(res.body).to.include({ name: 'Laptop', price: 999.99, stock: 5 });
            expect(res.body.id).to.exist;
        });

        it('GET /api/products retourne tous les produits', async () => {
            const res = await request(app).get('/api/products');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array').with.lengthOf.at.least(1);
        });

        it('POST /api/products valide les champs obligatoires', async () => {
            const res = await request(app)
                .post('/api/products')
                .send({ stock: 10 });

            expect(res.status).to.equal(400);
            expect(res.body.error).to.include('name and price are required');
        });
    });

    describe('Users', () => {
        it('POST /api/users crée un utilisateur', async () => {
            const res = await request(app)
                .post('/api/users')
                .send({ name: 'Alice', email: 'alice@example.com' });

            expect(res.status).to.equal(201);
            expect(res.body).to.include({ name: 'Alice', email: 'alice@example.com', role: 'customer' });
        });

        it('GET /api/users retourne tous les utilisateurs', async () => {
            const res = await request(app).get('/api/users');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array').with.lengthOf.at.least(1);
        });

        it('POST /api/users rejette les emails en doublon', async () => {
            await request(app)
                .post('/api/users')
                .send({ name: 'Bob', email: 'bob@example.com' });

            const res = await request(app)
                .post('/api/users')
                .send({ name: 'Bob2', email: 'bob@example.com' });

            expect(res.status).to.equal(400);
            expect(res.body.error).to.include('Email already exists');
        });

        it('POST /api/users valide les champs obligatoires', async () => {
            const res = await request(app)
                .post('/api/users')
                .send({ name: 'Charlie' });

            expect(res.status).to.equal(400);
            expect(res.body.error).to.include('name and email are required');
        });
    });

    describe('Orders', () => {
        it('POST /api/orders crée une commande', async () => {
            // Créer un utilisateur d'abord
            const userRes = await request(app)
                .post('/api/users')
                .send({ name: 'User', email: `user${Date.now()}@example.com` });

            const userId = userRes.body.id;

            const res = await request(app)
                .post('/api/orders')
                .send({ userId, productIds: [1, 2] });

            expect(res.status).to.equal(201);
            expect(res.body).to.include({ userId, status: 'pending', total: 0 });
            expect(res.body.id).to.exist;
        });

        it('PATCH /api/orders/:id/status met à jour le statut', async () => {
            // Créer une commande d'abord
            const userRes = await request(app)
                .post('/api/users')
                .send({ name: 'Shipper', email: `shipper${Date.now()}@example.com` });

            const orderRes = await request(app)
                .post('/api/orders')
                .send({ userId: userRes.body.id, productIds: [1] });

            const orderId = orderRes.body.id;

            const res = await request(app)
                .patch(`/api/orders/${orderId}/status`)
                .send({ status: 'shipped' });

            expect(res.status).to.equal(200);
            expect(res.body.status).to.equal('shipped');
        });

        it('PATCH /api/orders/:id/status rejette un statut invalide', async () => {
            // Créer une commande d'abord
            const userRes = await request(app)
                .post('/api/users')
                .send({ name: 'InvalidStatus', email: `invalid${Date.now()}@example.com` });

            const orderRes = await request(app)
                .post('/api/orders')
                .send({ userId: userRes.body.id, productIds: [1] });

            const res = await request(app)
                .patch(`/api/orders/${orderRes.body.id}/status`)
                .send({ status: 'invalid_status' });

            expect(res.status).to.equal(400);
            expect(res.body.error).to.include('status must be one of');
        });

        it('POST /api/orders valide les champs obligatoires', async () => {
            const res = await request(app)
                .post('/api/orders')
                .send({ userId: 1 });

            expect(res.status).to.equal(400);
            expect(res.body.error).to.include('userId and productIds');
        });
    });
});
