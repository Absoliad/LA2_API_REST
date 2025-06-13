var express = require('express');
var router = express.Router();
const authController = require("./auth/authController");

router.use("/auth", authController);

const userRoutes = require('./userRoutes');

router.use('/', userRoutes);

module.exports = router;
