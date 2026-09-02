const express = require('express');
const router = express.Router();
const priceController = require('../controllers/price.controller');
const { protect } = require('../middleware/auth.middleware');
const adminOnly = require('../middleware/admin.middleware');

router.get('/', priceController.getAllPrices);
router.get('/:category', priceController.getByCategory);
router.put('/:id', protect, adminOnly, priceController.updatePrice);

module.exports = router;
