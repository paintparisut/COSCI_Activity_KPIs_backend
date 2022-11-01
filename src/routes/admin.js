const express = require('express');
const router = express.Router();

const AdminController = require('../controller/AdminController');

router.post('/admin-add-activity',AdminController.upload)

module.exports = router;