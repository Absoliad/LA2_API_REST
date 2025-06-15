var express = require('express');
var router = express.Router();
const authRoutes = require("./auth/routes");
const auth = require("../middlewares/authMiddleware");

router.use("/auth", auth(), authRoutes);


module.exports = router;
