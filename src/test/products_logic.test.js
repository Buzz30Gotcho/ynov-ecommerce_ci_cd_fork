const products = require('../data/products');
const productsRouter = require('../routes/products');

describe('products route logic', () => {
    it('getProductsV1 retourne la liste originale de produits', () => {
        const data = productsRouter.getProductsV1();
        expect(data).toBe(products);
    });

    it('getProductsV2 enrichit les produits avec available et priceFormatted', () => {
        const data = productsRouter.getProductsV2();
        expect(Array.isArray(data)).toBe(true);
        expect(data).toHaveLength(products.length);

        data.forEach((product, index) => {
            const original = products[index];
            expect(product).toEqual(expect.objectContaining({
                available: expect.any(Boolean),
                priceFormatted: expect.any(String)
            }));
            expect(product.available).toBe(original.stock > 0);
            expect(product.priceFormatted).toBe(`€${original.price.toFixed(2)}`);
        });
    });
});
