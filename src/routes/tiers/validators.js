const { check } = require('express-validator');

const tiersValidators = {
  create: [
    check('nomTiers').notEmpty().withMessage('Le nom du tiers est requis'),

    check('dateHeureCreation').notEmpty().withMessage('La date de création est requise').isISO8601().withMessage('La date de création doit être au format ISO 8601'),

    check('dateHeureMAJ').notEmpty().withMessage('La date de mise à jour est requise').isISO8601().withMessage('La date de mise à jour doit être au format ISO 8601'),

    check('idUtilisateur').isInt({ gt: 0 }).withMessage("L'idUtilisateur doit être un entier positif"),
  ],

  update: [
    check('nomTiers').optional().notEmpty().withMessage('Le nom du tiers ne doit pas être vide'),

    check('dateHeureCreation').optional().isISO8601().withMessage('La date de création doit être au format ISO 8601'),

    check('dateHeureMAJ').optional().isISO8601().withMessage('La date de mise à jour doit être au format ISO 8601'),

    check('idUtilisateur').optional().isInt({ gt: 0 }).withMessage("L'idUtilisateur doit être un entier positif"),
  ],
};

module.exports = tiersValidators;

