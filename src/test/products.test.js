const products = require('../data/products');

describe('products', () => {
    it('devrait contenir un tableau', () => {
        expect(Array.isArray(products)).toBe(true);
    });

    it('devrait avoir des produits avec un id', () => {
        expect(products[0]).toHaveProperty('id');
    });

    it('devrait avoir des produits avec un nom', () => {
        expect(products[0]).toHaveProperty('name');
    });

    it('id 1 devrait être Laptop Pro 15', () => {
        const product = products.find(p => p.id === 1);
        expect(product).toBeDefined();
        expect(product.name).toBe('Laptop Pro 15');
    });

    it('id 2 devrait être Wireless Mouse', () => {
        const product = products.find(p => p.id === 2);
        expect(product).toBeDefined();
        expect(product.name).toBe('Wireless Mouse');
    });

    it('id 3 devrait être Mechanical Keyboard', () => {
        const product = products.find(p => p.id === 3);
        expect(product).toBeDefined();
        expect(product.name).toBe('Mechanical Keyboard');
    });

    it('id 3 devrait avoir comme prix 149.99', () => {
        const product = products.find(p => p.id === 3);
        expect(product).toBeDefined();
        expect(product.price).toBe(149.99);
    });

    it('id 4 devrait être USB-C Hub', () => {
        const product = products.find(p => p.id === 4);
        expect(product).toBeDefined();
        expect(product.name).toBe('USB-C Hub');
    });

    it('id 4 devrait avoir comme prix 59.99', () => {
        const product = products.find(p => p.id === 4);
        expect(product).toBeDefined();
        expect(product.price).toBe(59.99);
    });

    it('id 5 devrait être Standing Desk', () => {
        const product = products.find(p => p.id === 5);
        expect(product).toBeDefined();
        expect(product.name).toBe('Standing Desk');
    });

    it('id 5 devrait avoir comme prix 499.99', () => {
        const product = products.find(p => p.id === 5);
        expect(product).toBeDefined();
        expect(product.price).toBe(499.99);
    });
});
