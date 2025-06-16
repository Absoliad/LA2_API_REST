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
 *   name: Virement
 *   description: Gestion des virements
 */

/**
 * @swagger
 * /virements:
 *   post:
 *     summary: Créer un virement qui déclenche le trigger pour créer deux mouvements
 *     tags: [Virement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Virement'
 *     responses:
 *       201:
 *         description: Virement créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Virement'
 */


router.post('/', validate(validators.createVirement), controller.createVirement);

/**
 * @swagger
 * /virements:
 *   get:
 *     summary: Récupérer tous les virements de l'utilisateur connecté
 *     tags: [Virement]
 *     responses:
 *       200:
 *         description: Liste des virements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Virement'
 */
router.get('/', controller.getAllVirements);


/**
 * @swagger
 * /virements/{idVirement}:
 *   delete:
 *     summary: Supprimer un virement par ID
 *     tags: [Virement]
 *     parameters:
 *       - in: path
 *         name: idVirement
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du virement à supprimer
 *     responses:
 *       204:
 *         description: Virement supprimé avec succès
 */
router.delete('/:idVirement', validate(validators.deleteVirement), controller.deleteVirement);


module.exports = router;