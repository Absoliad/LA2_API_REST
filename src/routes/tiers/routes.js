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
 * /tiers:
 *   get:
 *     summary: Liste tous les tiers
 *     tags: [Tiers]
 *     responses:
 *       200:
 *         description: Liste des tiers
 */
router.get('/', controller.getAllTiers);

/**
 * @swagger
 * /tiers/{idTiers}:
 *   get:
 *     summary: Récupère un tiers par ID
 *     tags: [Tiers]
 *     parameters:
 *       - in: path
 *         name: idTiers
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails d’un tiers
 *       404:
 *         description: Tiers non trouvé
 */
router.get('/:idTiers', controller.getOne);

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
 *             $ref: '#/components/schemas/Tiers'
 *     responses:
 *       201:
 *         description: Tiers créé
 *       400:
 *         description: Erreur de validation
 */
router.post('/', validate(validators.create), controller.create);

/**
 * @swagger
 * /tiers/{idTiers}:
 *   delete:
 *     summary: Supprime un tiers
 *     tags: [Tiers]
 *     parameters:
 *       - in: path
 *         name: idTiers
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tiers supprimé
 *       404:
 *         description: Tiers non trouvé
 */
router.delete('/:idTiers', controller.remove);

/**
 * @swagger
 * /tiers/{idTiers}:
 *   patch:
 *     summary: Met à jour un tiers
 *     tags: [Tiers]
 *     parameters:
 *       - in: path
 *         name: idTiers
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tiers'
 *     responses:
 *       200:
 *         description: Tiers mis à jour
 *       400:
 *         description: Erreur de validation
 */
router.patch('/:idTiers', validate(validators.update), controller.update);

module.exports = router;
