// const dbPersonnes = require('../personnes/db');
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // const personne = await dbPersonnes.getPersonneByEmail(email);
    // if (!personne) {
    //   return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    // }
    
    const valid = await argon2.verify(personne.password_hash, password);
    if (!valid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    const payload = {
      id: personne.id,
      nom: personne.nom,
      prenom: personne.prenom,
      email: personne.email,
      est_admin: personne.est_admin,
      est_accompagnant: personne.est_accompagnant
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '12h' });
    return res.status(200).json({ 
      token : token,
      user : {
        id: personne.id,
        nom: personne.nom,
        prenom: personne.prenom,
        email: personne.email,
        est_admin: personne.est_admin,
        est_accompagnant: personne.est_accompagnant
      }
    });
  } catch (err) {
    next(err);
  }
};
