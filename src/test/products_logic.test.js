const { expect } = require('chai');
const products = require('../data/products');
const productsRouter = require('../routes/products');

describe('products route logic', () => {
    it('getProductsV1 retourne la liste originale de produits', () => {
        const data = productsRouter.getProductsV1();
        expect(data).to.equal(products);
    });

    it('getProductsV2 enrichit les produits avec available et priceFormatted', () => {
        const data = productsRouter.getProductsV2();
        expect(data).to.be.an('array').with.lengthOf(products.length);

        data.forEach((product, index) => {
            const original = products[index];
            expect(product).to.include.keys('available', 'priceFormatted');
            expect(product.available).to.equal(original.stock > 0);
            expect(product.priceFormatted).to.equal(`€${original.price.toFixed(2)}`);
        });
    });
});
