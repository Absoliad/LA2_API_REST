const { check, param } = require('express-validator');

const authValidators = {
  getAllComptes: [
    check('fields')
      .optional()
      .isString()
      .withMessage('Les champs doivent être une chaîne de caractères, séparés par des virgules'),
  ],
  createCompte: [
    check('descriptionCompte')
      .isString()
      .withMessage('La description du compte doit être une chaîne de caractères'),
    check('nomBanque')
      .isString()
      .withMessage('Le nom de la banque doit être une chaîne de caractères'),
  ],
  updateCompte: [
    param('idCompte')
      .isInt()
      .withMessage('L\'ID du compte doit être un entier'),
    check('descriptionCompte')
      .optional()
      .isString()
      .withMessage('La description du compte doit être une chaîne de caractères'),
    check('nomBanque')
      .optional()
      .isString()
      .withMessage('Le nom de la banque doit être une chaîne de caractères'),
  ],
  getVirementsByCompte: [
    param('idComptes')
      .isInt()
      .withMessage('L\'ID du compte doit être un entier'),
  ],
  getVirementsByCompteAndCategorie: [
    param('idComptes')
      .isInt()
      .withMessage('L\'ID du compte doit être un entier'),
    param('idCategorie')
      .isInt()
      .withMessage('L\'ID de la catégorie doit être un entier'),
  ],
  getVirementsByCompteCategorieSousCategorie: [
    param('idComptes')
      .isInt()
      .withMessage('L\'ID du compte doit être un entier'),
    param('idCategorie')
      .isInt()
      .withMessage('L\'ID de la catégorie doit être un entier'),
    param('idSousCategorie')
      .isInt()
      .withMessage('L\'ID de la sous-catégorie doit être un entier'),
  ],
};

module.exports = authValidators;
