var express = require('express');
var router = express.Router();
const authController = require("./auth/authController");

router.use("/auth", authController);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
