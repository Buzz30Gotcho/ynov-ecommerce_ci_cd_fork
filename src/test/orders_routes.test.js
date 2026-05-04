const request = require('supertest');
const app = require('../index');
const orders = require('../data/orders');

const originalOrders = orders.map(order => ({ ...order }));

function resetOrders() {
    orders.length = 0;
    originalOrders.forEach(order => orders.push({ ...order }));
}

describe('orders API logic', () => {
    beforeEach(resetOrders);

    it('GET /api/orders renvoie toutes les commandes', async () => {
        const res = await request(app).get('/api/orders');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(3);
    });

    it('POST /api/orders valide les données manquantes', async () => {
        const res = await request(app).post('/api/orders').send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('userId and productIds[] are required');
    });

    it('POST /api/orders crée une commande pending', async () => {
        const res = await request(app)
            .post('/api/orders')
            .send({ userId: 2, productIds: [1, 3] });

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({ userId: 2, status: 'pending', total: 0 });
        expect(res.body.productIds).toEqual([1, 3]);
        expect(res.body.id).toBe(4);
    });

    it('PATCH /api/orders/:id/status met à jour le statut', async () => {
        const res = await request(app)
            .patch('/api/orders/2/status')
            .send({ status: 'shipped' });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('shipped');
        expect(orders.find(o => o.id === 2).status).toBe('shipped');
    });

    it('PATCH /api/orders/:id/status rejette un statut invalide', async () => {
        const res = await request(app)
            .patch('/api/orders/2/status')
            .send({ status: 'invalid' });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/status must be one of/);
    });

    it('GET /api/orders/:id renvoie 404 si la commande n’existe pas', async () => {
        const res = await request(app).get('/api/orders/999');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Order not found');
    });
});
