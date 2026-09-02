const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { protect } = require('../middleware/auth.middleware');
const adminOnly = require('../middleware/admin.middleware');

router.get('/', blogController.getPosts);
router.get('/:slug', blogController.getPostBySlug);
router.post('/', protect, adminOnly, blogController.createPost);

module.exports = router;
