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
 *   name: Mouvements
 *   description: Gestion des mouvements
 */

/**
 * @swagger
 * /mouvements:
 *   get:
 *     summary: Récupère tous les mouvements
 *     tags:
 *       - Mouvements
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des mouvements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mouvement'
 */
router.get('/', validate(validators.getAllMouvements), controller.getAllMouvements);


/**
 * @swagger
 * /mouvements:
 *   post:
 *     summary: Crée un nouveau mouvement
 *     tags:
 *       - Mouvements
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mouvement'
 *     responses:
 *       201:
 *         description: Mouvement créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mouvement'
 */
router.post('/', validate(validators.addMouvements), controller.addMouvements);


/**
 * @swagger
 * /mouvements/{id}:
 *   delete:
 *     summary: Supprime un mouvement par son ID
 *     tags:
 *       - Mouvements
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID du mouvement à supprimer
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mouvement supprimé avec succès
 *       404:
 *         description: Mouvement non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', validate(validators.deleteMouvements), controller.deleteMouvements);


/**
 * @swagger
 * /mouvements/{id}:
 *   patch:
 *     summary: Met à jour partiellement un mouvement par son ID
 *     tags:
 *       - Mouvements
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID du mouvement à mettre à jour
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MouvementUpdate'
 *     responses:
 *       200:
 *         description: Mouvement mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mouvement'
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Mouvement non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.patch('/:id', validate(validators.patchMouvements), controller.patchMouvements);

module.exports = router;
