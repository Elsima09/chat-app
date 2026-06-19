const express = require('express');
const upload = require('../middlewares/uploadMiddleware');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

router.post('/upload-image', upload.single('image'), uploadController.uploadImage);
router.post('/upload-audio', upload.single('audio'), uploadController.uploadAudio);
router.post('/upload-document', upload.single('document'), uploadController.uploadDocument);
router.post('/upload-avatar', upload.single('avatar'), uploadController.uploadAvatar);

module.exports = router;
