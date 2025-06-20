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
 * /categories:
 *   get:
 *     summary: Liste toutes les catégories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categorie'
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', controller.getAllCategories);

/**
 * @swagger
 * /categories/{idCategorie}:
 *   get:
 *     summary: Récupère une catégorie par ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: idCategorie
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Détails de la catégorie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorie'
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:idCategorie', controller.getCategorieById);

/**
 * @swagger
 * /categories/{idCategorie}/sous-categories:
 *   get:
 *     summary: Liste les sous-catégories d'une catégorie
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: idCategorie
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Liste des sous-catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SousCategorie'
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:idCategorie/sous-categories', controller.getSousCategoriesByCategorieId);

module.exports = router;