const users = require('../data/users');

describe('users', () => {
    it('devrait contenir un tableau', () => {
        expect(Array.isArray(users)).toBe(true);
    });

    it('devrait avoir des utilisateurs avec un id', () => {
        expect(users[0]).toHaveProperty('id');
    });

    it('devrait avoir des utilisateurs avec un nom', () => {
        expect(users[0]).toHaveProperty('name');
    });

    it('id 1 devrait être Alice Martin', () => {
        const user = users.find(u => u.id === 1);
        expect(user).toBeDefined();
        expect(user.name).toBe('Alice Martin');
    });

    it('id 2 devrait être Bob Dupont', () => {
        const user = users.find(u => u.id === 2);
        expect(user).toBeDefined();
        expect(user.name).toBe('Bob Dupont');
    });

    it('id 3 devrait être Charlie Leroy', () => {
        const user = users.find(u => u.id === 3);
        expect(user).toBeDefined();
        expect(user.name).toBe('Charlie Leroy');
    });

    it('id 3 devrait avoir comme email charlie@example.com', () => {
        const user = users.find(u => u.id === 3);
        expect(user).toBeDefined();
        expect(user.email).toBe('charlie@example.com');
    });
});
