var express = require('express');
var router = express.Router();
const authRoutes = require("./auth/routes");
const auth = require("../middlewares/authMiddleware");
const comptesRoutes = require("./comptes/routes");
const virementsRoutes = require("./virement/routes");

router.use("/auth" ,authRoutes);
router.use("/comptes", auth(), comptesRoutes);
router.use("/virements", auth(), virementsRoutes);

module.exports = router;
