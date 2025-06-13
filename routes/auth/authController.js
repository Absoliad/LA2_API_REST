const express = require("express");
const router = express.Router();
const { login } = require("./authService");

router.post("/login", (req, res, next) => {

    const body = req.body;
    // Call service to handle registration
    try {
        const result = login(body);
       res.status(200).json({result});
    } catch (error) {
        next(error);
    }
  authCtrl.login(req, res, next);
});

module.exports = router;
