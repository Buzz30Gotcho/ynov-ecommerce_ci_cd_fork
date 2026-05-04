const request = require('supertest');
const app = require('../index');
const products = require('../data/products');

describe('products API', () => {
    it('GET /api/products returns products list', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/products/:id returns a product', async () => {
        const res = await request(app).get('/api/products/1');
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(1);
    });

    it('GET /api/products/:id returns 404 for unknown product', async () => {
        const res = await request(app).get('/api/products/999');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Product not found');
    });

    it('POST /api/products creates a product', async () => {
        const newProd = { name: 'Test Product', price: 10, stock: 5 };
        const res = await request(app).post('/api/products').send(newProd);
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Test Product');
    });

    it('POST /api/products returns 400 if name is missing', async () => {
        const res = await request(app).post('/api/products').send({ price: 10 });
        expect(res.status).toBe(400);
    });
});
