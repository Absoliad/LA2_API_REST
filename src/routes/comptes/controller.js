const dbPersonnes = require('./db');
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');

exports.getAllcomptes = async (req, res) => {
  try {
    console.log(req.user.idUtilisateur);
    // const comptes = await dbPersonnes.getAllComptes();
    return res.status(200).json(req.user) ;
  } catch (error) {
    console.error('Error fetching comptes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}