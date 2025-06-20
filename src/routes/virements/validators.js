const { check,param } = require('express-validator');

const virementValidators = {
  createVirement: [
    check('idCompteDebit').isInt().withMessage('ID du compte débiteur requis'),
    check('idCompteCredit').isInt().withMessage('ID du compte créditeur requis'),
    check('montant').isFloat({ gt: 0 }).withMessage('Montant requis et doit être positif'),
    check('dateVirement').optional().isISO8601().withMessage('Date de virement doit être au format ISO 8601'),
    check('idTiers').optional().isInt().withMessage('ID de tiers doit être un entier'),
    check('idCategorie').optional().isInt().withMessage('ID de catégorie doit être un entier'),
  ],
  deleteVirement: [
    param('idVirement').isInt().withMessage('ID du virement requis'),
  ],
  updateVirement: [
    param('idVirement').isInt().withMessage('ID du virement requis'),
    check('idCategorie').isInt().withMessage('ID de catégorie requis')
  ]
};


module.exports = virementValidators;