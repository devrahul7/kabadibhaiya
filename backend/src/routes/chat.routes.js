const router = require('express').Router();
const { chatLimiter } = require('../middleware/rateLimiter');
const { chat } = require('../controllers/chat.controller');

router.post('/', chatLimiter, chat);

module.exports = router;
