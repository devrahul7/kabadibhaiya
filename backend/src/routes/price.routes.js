const express = require('express');
const router = express.Router();
const priceController = require('../controllers/price.controller');
const { protect } = require('../middleware/auth.middleware');
const adminOnly = require('../middleware/admin.middleware');
const upload = require('../middleware/upload');

// Public routes
router.get('/', priceController.getAllPrices);
router.get('/image/:id', priceController.getPriceImage);
router.get('/category/:category', priceController.getByCategory);

// Admin-protected routes
router.post('/', protect, adminOnly, upload.single('itemImage'), priceController.createPrice);
router.put('/:id', protect, adminOnly, upload.single('itemImage'), priceController.updatePrice);
router.delete('/:id', protect, adminOnly, priceController.deletePrice);

module.exports = router;
