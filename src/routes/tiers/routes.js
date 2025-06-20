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

module.exports = router;
