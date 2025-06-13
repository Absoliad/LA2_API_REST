const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupère la liste des utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Alice
 */
router.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       description: Données à modifier
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alice Modifiée
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Alice Modifiée
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Le champ 'name' est requis." });
  }

  // Simule une recherche et une mise à jour
  if (userId !== 1) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  res.json({ id: userId, name });
});

module.exports = router;
