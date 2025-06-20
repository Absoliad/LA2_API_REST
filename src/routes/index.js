var express = require('express');
var router = express.Router();
const authRoutes = require("./auth/routes");
const auth = require("../middlewares/authMiddleware");
const comptesRoutes = require("./comptes/routes");
const TiersRoutes = require("./tiers/routes"); 
const virementsRoutes = require("./virements/routes");

router.use("/auth" ,authRoutes);
router.use("/comptes", auth(), comptesRoutes);
router.use("/tiers", auth(), TiersRoutes);
router.use("/virements", auth(), virementsRoutes);

module.exports = router;
