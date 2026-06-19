function uploadImage(req, res) {
    if (!req.file) {
        return res.json({ success: false });
    }

    res.json({ success: true, imageUrl: '/uploads/' + req.file.filename });
}

function uploadAudio(req, res) {
    if (!req.file) {
        return res.json({ success: false });
    }

    res.json({ success: true, audioUrl: '/uploads/' + req.file.filename });
}

function uploadDocument(req, res) {
    if (!req.file) {
        return res.json({ success: false });
    }

    res.json({
        success: true,
        documentUrl: '/uploads/' + req.file.filename,
        documentName: req.file.originalname,
        documentSize: req.file.size
    });
}

function uploadAvatar(req, res) {
    if (!req.file) {
        return res.json({ success: false });
    }

    res.json({ success: true, avatarUrl: '/uploads/' + req.file.filename });
}

module.exports = {
    uploadImage,
    uploadAudio,
    uploadDocument,
    uploadAvatar
};
