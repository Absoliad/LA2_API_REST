const { check } = require('express-validator');

const authValidators = {
  login: [
    check('login').isString().withMessage('login requis'),
    check('mdp').isLength({ min: 8 }).withMessage('Mot de passe requis (min 8 caractères)'),
  ],
  register: [
    check('nomUtilisateur').notEmpty().withMessage('Nom d’utilisateur requis'),
    check('prenomUtilisateur').notEmpty().withMessage('Prénom d’utilisateur requis'),
    check('login').isString().withMessage('Login requis (doit être un email)'),
    check('mdp').isLength({ min: 8 }).withMessage('Mot de passe requis (min 8 caractères)'),
    check('ville').optional().notEmpty().withMessage('Ville optionnelle mais ne doit pas être vide'),
    check('codePostal').optional().isPostalCode('any').withMessage('Code postal optionnel mais doit être valide'),
  ],
};

module.exports = authValidators;
