const { check } = require('express-validator');

const tiersValidators = {
  create: [
    check('nomTiers').notEmpty().withMessage('Le nom du tiers est requis'),
    check('idUtilisateur').isInt({ gt: 0 }).withMessage("L'idUtilisateur doit être un entier positif"),
  ],

  update: [
    check('nomTiers').optional().notEmpty().withMessage('Le nom du tiers ne doit pas être vide'),
    check('idUtilisateur').optional().isInt({ gt: 0 }).withMessage("L'idUtilisateur doit être un entier positif"),
  ],
};

module.exports = tiersValidators;

