const express = require('express');
const { protectRoute } = require('../middleware/protectRoute');
const {chatList, updateProfile, updateProfilePic} = require('../controller/userController');
const upload = require('../utils/multerUpload');

const router = express.Router();

// contacts (chats list) routes
router.get('/chats', protectRoute, chatList);

router.put('/profile/update', protectRoute, updateProfile);
router.put('/profile/avatar/update', protectRoute, upload.single('profilePic'), updateProfilePic);

module.exports = router;
