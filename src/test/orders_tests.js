const { expect } = require('chai');
const orders = require('../data/orders');

describe('orders', () => {
    it('devrait contenir un tableau', () => {
        expect(orders).to.be.an('array');
    });

    it('devrait avoir des commandes avec un id', () => {
        expect(orders[0]).to.have.property('id');
    });

});



