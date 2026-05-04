const orders = require('../data/orders');

describe('orders', () => {
    it('devrait contenir un tableau', () => {
        expect(Array.isArray(orders)).toBe(true);
    });

    it('devrait avoir des commandes avec un id', () => {
        expect(orders[0]).toHaveProperty('id');
    });
});
