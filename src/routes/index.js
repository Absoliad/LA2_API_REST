var express = require('express');
var router = express.Router();
const authRoutes = require("./auth/routes");
const auth = require("../middlewares/authMiddleware");
const comptesRoutes = require("./comptes/routes");
const TiersRoutes = require("./tiers/routes"); 
const mouvementsRoutes = require("./mouvements/routes");
const categoriesRoutes = require("./categories/routes");
const virementsRoutes = require("./virements/routes");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Bienvenue dans l'API de gestion de comptes bancaires"
  });
});

router.use("/auth" ,authRoutes);
router.use("/comptes", auth(), comptesRoutes);
router.use("/tiers", auth(), TiersRoutes);
router.use("/categories", auth(), categoriesRoutes);
router.use("/virements", auth(), virementsRoutes);
router.use("/mouvements", auth(), mouvementsRoutes);
module.exports = router;
