const express = require('express');
const router = express.Router();
const products = require('../data/products');

const featureFlags = require('../config/featureFlags');
//const featureFlagsConfig = require('../config/featureFlags');
//const FEATURE_V2_PRODUCTS = process.env.FEATURE_V2_PRODUCTS === 'true';


function getProductsV1() {
  return products;
}

function getProductsV2() {
  return products.map(p => ({
    ...p,
    available: p.stock > 0,
    priceFormatted: `€${p.price.toFixed(2)}`,
  }));
}

// GET /api/products
router.get('/', (req, res) => {
  const data = featureFlags.productsV2 ? getProductsV2() : getProductsV1();
  res.json(data);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const result = featureFlags.productsV2
    ? {
      ...product,
      available: product.stock > 0,
      priceFormatted: `€${product.price.toFixed(2)}`,
    }
    : product;

  res.json(result);
});


// POST /api/products
router.post('/', (req, res) => {
  const { name, price, stock, category } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'name and price are required' });
  }
  const newProduct = {
    id: products.length + 1,
    name,
    price,
    stock: stock ?? 0,
    category: category ?? 'misc',
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

module.exports = router;
