const express = require('express');
const multer = require('multer');
const { protectRoute } = require('../middleware/protectRoute');
const { handleFetchMessages, handleSendMessage } = require('../controller/messageController');

const router = express.Router();

const storage = multer.memoryStorage(); // Use memory storage to get file buffer
const upload = multer({ storage });

router.post('/', protectRoute, handleFetchMessages);
router.post('/send', protectRoute, upload.single('image'), handleSendMessage);

module.exports = router;
