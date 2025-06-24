const express = require('express');
const router = express.Router();
const controller = require('./controller');
const validators = require('./validators');
const { validationResult } = require('express-validator');

// Middleware de validation
const validate = (validations) => [
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
 *   name: Tiers
 *   description: Gestion des tiers
 */
/**
 * @swagger
 * tags:
 *   name: Tiers
 *   description: Gestion des tiers
 */

/**
 * @swagger
 * /tiers:
 *   get:
 *     summary: Liste tous les tiers de l'utilisateur
 *     tags: [Tiers]
 *     responses:
 *       200:
 *         description: Liste des tiers
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', controller.getAllTiers);

/**
 * @swagger
 * /tiers/{idTiers}:
 *   get:
 *     summary: Récupère un tiers par son ID
 *     tags: [Tiers]
 *     parameters:
 *       - in: path
 *         name: idTiers
 *         required: true
 *         description: ID du tiers à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails du tiers
 *       404:
 *         description: Tiers non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:idTiers', controller.getTiersById);

/**
 * @swagger
 * /tiers:
 *   post:
 *     summary: Crée un nouveau tiers
 *     tags: [Tiers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomTiers
 *               - idUtilisateur
 *             properties:
 *               nomTiers:
 *                 type: string
 *                 example: "Supermarché"
 *               idUtilisateur:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Tiers créé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la création du tiers
 */
router.post('/', validate(validators.create), controller.createTiers);

/**
 * @swagger
 * /tiers:
 *   delete:
 *     summary: Supprime un tiers
 *     tags: [Tiers]
 *     parameters:
 *       - in: query
 *         name: idTiers
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: ID du tiers à supprimer
 *     responses:
 *       204:
 *         description: Tiers supprimé avec succès
 *       400:
 *         description: idTiers doit être un entier positif
 *       404:
 *         description: Tiers non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/', controller.deleteTiers);

/**
 * @swagger
 * /tiers/{idTiers}:
 *   patch:
 *     summary: Met à jour un tiers par son ID
 *     tags: [Tiers]
 *     parameters:
 *       - in: path
 *         name: idTiers
 *         required: true
 *         description: ID du tiers à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomTiers:
 *                 type: string
 *                 example: "Nouvel Épicier"
 *               idUtilisateur:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *     responses:
 *       204:
 *         description: Tiers mis à jour avec succès
 *       400:
 *         description: idTiers doit être un entier positif ou aucun champ à mettre à jour
 *       404:
 *         description: Tiers ou utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.patch('/:idTiers', validate(validators.update), controller.updateTiers);

module.exports = router;
