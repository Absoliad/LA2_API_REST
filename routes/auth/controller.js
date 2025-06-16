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

exports.register = async (req, res, next) => {
  try {
    const { nom, prenom, email, password } = req.body;
    // Vérifier si l'utilisateur existe déjà
    // const existingUser = await dbPersonnes.getPersonneByEmail(email);
    // if (existingUser) {
    //   return res.status(400).json({ message: 'Utilisateur déjà existant' });
    // }
    
    // Hacher le mot de passe
    const passwordHash = await argon2.hash(password);
    
    // Enregistrer l'utilisateur dans la base de données
    // const newUser = await dbPersonnes.createPersonne({
    //   nom,
    //   prenom,
    //   email,
    //   password_hash: passwordHash
    // });
    
    return res.status(201).json({ 
      message: 'Utilisateur créé avec succès',
      user: {
        id: newUser.id,
        nom: newUser.nom,
        prenom: newUser.prenom,
        email: newUser.email
      }
    });
  } catch (err) {
    next(err);
  }
}
