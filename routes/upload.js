// 수업참여0507-최지현(60211704)
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/upload.html'));
});

router.post('/', upload.fields([{ name: 'image1' }, { name: 'image2' }]), (req, res) => {
    console.log(req.file, req.body);
    res.send(`Files Uploaded!`);
});

module.exports = router;
