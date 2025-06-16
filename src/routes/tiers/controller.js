const dbTiers = require('./db');
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');

exports.getAllTiers = async (req, res) => {
  try {
    console.log(req.user.idUtilisateur);
    const result = await dbTiers.getAllTiers(req.user.idUtilisateur)
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching comptes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}