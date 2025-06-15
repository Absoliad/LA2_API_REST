const { check } = require('express-validator');

const authValidators = {
  login: [
    check('email').isEmail().withMessage('Email requis'),
    check('password').isLength({ min: 8 }).withMessage('Mot de passe requis (min 8 caractères)'),
  ],
};

module.exports = authValidators;
