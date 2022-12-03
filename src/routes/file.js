const express = require('express');
const router = express.Router();
const jwt = require('../jwt');
const FileController = require('../controller/FileController');

router.post('/uploadimg',jwt.verify, FileController.uploadImage);
router.post('/uploadpdf',jwt.verify, FileController.uploadpdf);


module.exports = router;