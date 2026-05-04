const request = require('supertest');
const app = require('../index');
const users = require('../data/users');

describe('users API', () => {
    it('GET /api/users returns users list', async () => {
        const res = await request(app).get('/api/users');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/users/:id returns a user', async () => {
        const res = await request(app).get('/api/users/1');
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(1);
    });

    it('GET /api/users/:id returns 404 for unknown user', async () => {
        const res = await request(app).get('/api/users/999');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('User not found');
    });

    it('POST /api/users creates a user', async () => {
        const newUser = { name: 'John Doe', email: 'john@example.com' };
        const res = await request(app).post('/api/users').send(newUser);
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('John Doe');
    });

    it('POST /api/users returns 400 if email is missing', async () => {
        const res = await request(app).post('/api/users').send({ name: 'John' });
        expect(res.status).toBe(400);
    });
});
