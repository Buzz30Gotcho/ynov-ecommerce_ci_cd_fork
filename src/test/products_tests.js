const { expect } = require('chai');
const products = require('../data/products');

describe('products', () => {
    it('devrait contenir un tableau', () => {
        expect(products).to.be.an('array');
    });

    it('devrait avoir des produits avec un id', () => {
        expect(products[0]).to.have.property('id');
    });

    it('devrait avoir des produits avec un nom', () => {
        expect(products[0]).to.have.property('name');
    });

    it('id 1 devrait être Laptop Pro 15', () => {
        const product = products.find(p => p.id === 1);
        expect(product).to.exist;
        expect(product.name).to.equal('Laptop Pro 15');
    });

    it('id 2 devrait être Wireless Mouse', () => {
        const product = products.find(p => p.id === 2);
        expect(product).to.exist;
        expect(product.name).to.equal('Wireless Mouse');
    });

    it('id 3 devrait être Mechanical Keyboard', () => {
        const product = products.find(p => p.id === 3);
        expect(product).to.exist;
        expect(product.name).to.equal('Mechanical Keyboard');
    });

    it('id 3 devrait avoir comme prix 149.99', () => {
        const product = products.find(p => p.id === 3);
        expect(product).to.exist;
        expect(product.price).to.equal(149.99);
    });

    it('id 4 devrait être USB-C Hub', () => {
        const product = products.find(p => p.id === 4);
        expect(product).to.exist;
        expect(product.name).to.equal('USB-C Hub');
    });

    it('id 4 devrait avoir comme prix 59.99', () => {
        const product = products.find(p => p.id === 4);
        expect(product).to.exist;
        expect(product.price).to.equal(59.99);
    });

    it('id 5 devrait être Standing Desk', () => {
        const product = products.find(p => p.id === 5);
        expect(product).to.exist;
        expect(product.name).to.equal('Standing Desk');
    });

    it('id 5 devrait avoir comme prix 499.99', () => {
        const product = products.find(p => p.id === 5);
        expect(product).to.exist;
        expect(product.price).to.equal(499.99);
    });

});
