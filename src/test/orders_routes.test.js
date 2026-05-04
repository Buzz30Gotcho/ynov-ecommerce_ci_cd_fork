const request = require('supertest');
const { expect } = require('chai');
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
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array').with.lengthOf(3);
    });

    it('POST /api/orders valide les données manquantes', async () => {
        const res = await request(app).post('/api/orders').send({});
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal('userId and productIds[] are required');
    });

    it('POST /api/orders crée une commande pending', async () => {
        const res = await request(app)
            .post('/api/orders')
            .send({ userId: 2, productIds: [1, 3] });

        expect(res.status).to.equal(201);
        expect(res.body).to.include({ userId: 2, status: 'pending', total: 0 });
        expect(res.body.productIds).to.deep.equal([1, 3]);
        expect(res.body.id).to.equal(4);
    });

    it('PATCH /api/orders/:id/status met à jour le statut', async () => {
        const res = await request(app)
            .patch('/api/orders/2/status')
            .send({ status: 'shipped' });

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal('shipped');
        expect(orders.find(o => o.id === 2).status).to.equal('shipped');
    });

    it('PATCH /api/orders/:id/status rejette un statut invalide', async () => {
        const res = await request(app)
            .patch('/api/orders/2/status')
            .send({ status: 'invalid' });

        expect(res.status).to.equal(400);
        expect(res.body.error).to.include('status must be one of');
    });

    it('GET /api/orders/:id renvoie 404 si la commande n’existe pas', async () => {
        const res = await request(app).get('/api/orders/999');
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('Order not found');
    });
});
