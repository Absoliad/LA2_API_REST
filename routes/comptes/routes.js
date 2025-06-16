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
 *     responses:
 *       200:
 *         description: Liste des comptes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comptes'
 */
router.get('/', controller.getAllcomptes);

module.exports = router;
