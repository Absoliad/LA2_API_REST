const express = require('express');
const router = express.Router();
const controller = require('./controller');
const validators = require('./validators');
const { validationResult } = require('express-validator');

const validate = validations => [
  ...validations,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


/**
 * @swagger
 * tags:
 *   name: Comptes
 *   description: Gestion des comptes
 */
/**
 * @swagger
 * /comptes:
 *   get:
 *     summary: Liste tous les comptes
 *     tags: [Comptes]
 *     parameters:
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Champs à retourner, séparés par des virgules
 *     responses:
 *       200:
 *         description: Liste des comptes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Compte'
 *       404:
 *         description: Aucun compte trouvé pour cet utilisateur
 *       500:
 *         description: Erreur lors de la récupération des comptes
 */
router.get('/', controller.getAllComptes);

/**
 * @swagger
 * /comptes/{idCompte}:
 *   get:
 *     summary: Récupère un compte par son ID
 *     tags: [Comptes]
 *     parameters:
 *       - in: path
 *         name: idCompte
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du compte à récupérer
 *     responses:
 *       200:
 *         description: Compte trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Compte'
 *       404:
 *         description: Compte non trouvé
 *       500:
 *         description: Erreur lors de la récupération du compte
 */
router.get('/:idCompte', controller.getCompteById);

/**
 * @swagger
 * /comptes:
 *   post:
 *     summary: Crée un nouveau compte
 *     tags: [Comptes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCompte'
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comptes'
 *       400:
 *         description: Compte déjà existant ou données invalides
 *       500:
 *         description: Erreur lors de la création du compte
 */
router.post(
  '/',
  validate(validators.createCompte),
  controller.createCompte
);

/**
 * @swagger
 * /comptes/{idCompte}:
 *   patch:
 *     summary: Met à jour un compte existant
 *     tags: [Comptes]
 *     parameters:
 *       - in: path
 *         name: idCompte
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du compte à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCompte'
 *     responses:
 *       200:
 *         description: Compte mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comptes'
 *       404:
 *         description: Compte non trouvé
 *       500:
 *         description: Erreur lors de la mise à jour du compte
 */
router.patch(
  '/:idCompte',
  validate(validators.updateCompte),
  controller.updateCompte
);

/**
 * @swagger
 * /comptes/{idCompte}:
 *   delete:
 *     summary: Supprime un compte existant
 *     tags: [Comptes]
 *     parameters:
 *       - in: path
 *         name: idCompte
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du compte à supprimer
 *     responses:
 *       204:
 *         description: Compte supprimé avec succès
 *       404:
 *         description: Compte non trouvé
 *       500:
 *         description: Erreur lors de la suppression du compte
 */
router.delete('/:idCompte', controller.deleteCompte);

/**
 * @swagger
 * /comptes/{idCompte}/virements:
 *   get:
 *     summary: Liste les virements d'un compte
 *     tags: [Comptes]
 *     parameters:
 *       - in: path
 *         name: idCompte
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du compte
 *     responses:
 *       200:
 *         description: Liste des virements du compte
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Virement'
 *       404:
 *         description: Aucun virement trouvé pour ce compte
 *       500:
 *         description: Erreur lors de la récupération des virements
 */
router.get('/:idCompte/virements', controller.getVirementsByCompte);

/**
 * @swagger
 * /comptes/{idCompte}/categories/{idCategorie}/virements:
 *   get:
 *     summary: Liste les virements d'un compte pour une catégorie donnée
 *     tags: [Comptes]
 *     parameters:
 *       - in: path
 *         name: idCompte
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du compte
 *       - in: path
 *         name: idCategorie
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Liste des virements du compte pour la catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Virement'
 *       404:
 *         description: Aucun virement trouvé pour ce compte et cette catégorie
 *       500:
 *         description: Erreur lors de la récupération des virements par catégorie
 */
router.get('/:idCompte/categories/:idCategorie/virements', controller.getVirementsByCompteAndCategorie);

/**
 * @swagger
 * /comptes/{idCompte}/mouvements:
 *   get:
 *     summary: Liste les mouvements d'un compte
 *     tags: [Comptes]
 *     parameters:
 *       - in: path
 *         name: idCompte
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du compte
 *     responses:
 *       200:
 *         description: Liste des mouvements du compte
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mouvement'
 *       404:
 *         description: Aucun mouvement trouvé pour ce compte
 *       500:
 *         description: Erreur lors de la récupération des mouvements
 */
router.get('/:idCompte/mouvements', controller.getMouvementsByCompte);

/**
 * @swagger
 * /comptes/{idCompte}/categories/{idCategorie}/mouvements:
 *   get:
 *     summary: Liste les mouvements d'un compte pour une catégorie donnée
 *     tags: [Comptes]
 *     parameters:
 *       - in: path
 *         name: idCompte
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du compte
 *       - in: path
 *         name: idCategorie
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Liste des mouvements du compte pour la catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mouvement'
 *       404:
 *         description: Aucun mouvement trouvé pour ce compte et cette catégorie
 *       500:
 *         description: Erreur lors de la récupération des mouvements par catégorie
 */
router.get(
  '/:idCompte/categories/:idCategorie/mouvements',
  controller.getMouvementsByCompteAndCategorie
);

/**
 * @swagger
 * /comptes/{idCompte}/categories/{idCategorie}/sous-categories/{idSousCategorie}/mouvements:
 *   get:
 *     summary: Liste les mouvements d'un compte pour une sous-catégorie donnée
 *     tags: [Comptes]
 *     parameters:
 *       - in: path
 *         name: idCompte
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du compte
 *       - in: path
 *         name: idCategorie
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *       - in: path
 *         name: idSousCategorie
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sous-catégorie
 *     responses:
 *       200:
 *         description: Liste des mouvements du compte pour la sous-catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mouvement'
 *       404:
 *         description: Aucun mouvement trouvé pour ce compte, catégorie et sous-catégorie
 *       500:
 *         description: Erreur lors de la récupération des mouvements par sous-catégorie
 */
router.get(
  '/:idCompte/categories/:idCategorie/sous-categories/:idSousCategorie/mouvements',
  controller.getMouvementsByCompteCategorieSousCategorie
);

/**
 * @swagger
 * /comptes/{idCompte}/solde:
 *   get:
 *     summary: Récupère le solde d'un compte
 *     tags: [Comptes]
 *     parameters:
 *       - in: path
 *         name: idCompte
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du compte
 *     responses:
 *       200:
 *         description: Solde du compte
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 solde:
 *                   type: number
 *                   format: float
 *                   description: Solde du compte
 *       404:
 *         description: Solde non trouvé pour ce compte
 *       500:
 *         description: Erreur lors de la récupération du solde
 */
router.get('/:idCompte/solde', controller.getSoldeByCompte);

module.exports = router;