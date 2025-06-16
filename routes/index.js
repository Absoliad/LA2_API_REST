var express = require('express');
var router = express.Router();
const authRoutes = require("./auth/routes");
const auth = require("../middlewares/authMiddleware");
const comptesRoutes = require("./comptes/routes");

router.use("/auth" ,authRoutes);
router.use("/comptes", auth(), comptesRoutes);

module.exports = router;
