const multer = require('multer');
const path = require('path');

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const ALLOWED_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const ALLOWED_AUDIO_MIME_TYPES = ['audio/webm', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
const ALLOWED_DOCUMENT_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-zip-compressed',
    'text/plain'
];

function resolveAllowedMimeTypes(fieldname) {
    if (fieldname === 'audio') return ALLOWED_AUDIO_MIME_TYPES;
    if (fieldname === 'document') return ALLOWED_DOCUMENT_MIME_TYPES;
    return ALLOWED_IMAGE_MIME_TYPES;
}

function resolveFilenamePrefix(fieldname) {
    if (fieldname === 'audio') return 'audio_';
    if (fieldname === 'document') return 'document_';
    if (fieldname === 'avatar') return 'avatar_';
    return 'image_';
}

const storage = multer.diskStorage({
    destination: function setDestination(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function setFilename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, resolveFilenamePrefix(file.fieldname) + Date.now() + ext);
    }
});

function fileFilter(req, file, cb) {
    const allowedTypes = resolveAllowedMimeTypes(file.fieldname);

    if (allowedTypes.includes(file.mimetype)) {
        return cb(null, true);
    }

    cb(new Error('Tipe file tidak diizinkan'));
}

const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
    fileFilter
});

module.exports = upload;
