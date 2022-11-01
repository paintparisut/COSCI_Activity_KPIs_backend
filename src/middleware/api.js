const express = require("express");
const router = express.Router();
require("../db");
const { verify } = require("../jwt");

//public zone


router.use('/admin',require('../routes/admin'));



module.exports = router;
