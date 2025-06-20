const { check, param } = require('express-validator');

const mouvementValidators = {
  getAllMouvements: [
    // Pas de validation spécifique
  ],
  getMouvementById: [
    param('id').notEmpty().withMessage('L\'ID est requis').isInt().withMessage('L\'ID doit être un entier'),
  ],

  addMouvements: [
    check('idMouvement').notEmpty().withMessage('idMouvement est requis').isInt().withMessage('idMouvement doit être un entier'),
    check('dateMouvement').notEmpty().withMessage('dateMouvement est requise').isISO8601().withMessage('dateMouvement doit être au format date ISO'),
    check('idCompte').notEmpty().withMessage('idCompte est requis').isInt().withMessage('idCompte doit être un entier'),
    check('idTiers').optional({ nullable: true }).isInt().withMessage('idTiers doit être un entier'),
    check('idCategorie').optional({ nullable: true }).isInt().withMessage('idCategorie doit être un entier'),
    check('idSousCategorie').optional({ nullable: true }).isInt().withMessage('idSousCategorie doit être un entier'),
    check('idVirement').optional({ nullable: true }).isInt().withMessage('idVirement doit être un entier'),
    check('montant').notEmpty().withMessage('montant est requis').isFloat().withMessage('montant doit être un nombre'),
    check('typeMouvement').notEmpty().withMessage('typeMouvement est requis').isIn(['D', 'C']).withMessage('typeMouvement doit être "D" ou "C"'),
  ],

  deleteMouvements: [
    param('id').notEmpty().withMessage('L\'ID est requis').isInt().withMessage('L\'ID doit être un entier'),
  ],

  patchMouvements: [
    param('id').notEmpty().withMessage('L\'ID est requis').isInt().withMessage('L\'ID doit être un entier'),
    check('idMouvement').optional().isInt().withMessage('idMouvement doit être un entier'),
    check('dateMouvement').optional().isISO8601().withMessage('dateMouvement doit être au format date ISO'),
    check('idCompte').optional().isInt().withMessage('idCompte doit être un entier'),
    check('idTiers').optional({ nullable: true }).isInt().withMessage('idTiers doit être un entier'),
    check('idCategorie').optional({ nullable: true }).isInt().withMessage('idCategorie doit être un entier'),
    check('idSousCategorie').optional({ nullable: true }).isInt().withMessage('idSousCategorie doit être un entier'),
    check('idVirement').optional({ nullable: true }).isInt().withMessage('idVirement doit être un entier'),
    check('montant').optional().isFloat().withMessage('montant doit être un nombre'),
    check('typeMouvement').optional().isIn(['D', 'C']).withMessage('typeMouvement doit être "D" ou "C"'),
  ],
};

module.exports = mouvementValidators;
