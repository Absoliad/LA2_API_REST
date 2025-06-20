const dbPersonnes = require('./db');
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');
const ApiError = require('../../middlewares/ApiError');
const httpStatusCodes = require('../../middlewares/httpStatusCodes');

exports.login = async (req, res, next) => {
  try {
    const { login, mdp } = req.body;
    const personne = await dbPersonnes.getPersonneByLogin(login);
    if (!personne) {
      return next(new ApiError(httpStatusCodes.UNAUTHORIZED.code, 'Email ou mot de passe incorrect'));
    }
    
    const valid = await argon2.verify(personne.mdp, mdp);
    if (!valid) {
      return next(new ApiError(httpStatusCodes.UNAUTHORIZED.code, 'Email ou mot de passe incorrect'));
    }
    const payload = {
      idUtilisateur: personne.idUtilisateur,
      nomUtilisateur: personne.nomUtilisateur,
      prenomUtilisateur: personne.prenomUtilisateur,
      login: personne.login,
      mdp: personne.mdp,
      ville: personne.ville || null,
      codePostal: personne.codePostal || null,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '12h' });
    return res.status(httpStatusCodes.OK.code).json({ 
      token : token,
      user : {
        idUtilisateur: personne.idUtilisateur,
        nomUtilisateur: personne.nomUtilisateur,
        prenomUtilisateur: personne.prenomUtilisateur,
        login: personne.login,
        mdp: personne.mdp,
        ville: personne.ville || null,
        codePostal: personne.codePostal || null,
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { nomUtilisateur, prenomUtilisateur, login, mdp } = req.body;
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await dbPersonnes.getPersonneByLogin(login);
    if (existingUser) {
      return next(new ApiError(httpStatusCodes.BAD_REQUEST.code, 'Utilisateur déjà existant'));
    }
    
    // Hacher le mot de passe
    const passwordHash = await argon2.hash(mdp);
    
    // Enregistrer l'utilisateur dans la base de données
    const newUser = await dbPersonnes.createPersonne({
      nomUtilisateur,
      prenomUtilisateur,
      login,
      password_hash: passwordHash
    });
    
    return res.status(httpStatusCodes.CREATED.code).json({ 
      message: 'Utilisateur créé avec succès',
      user: {
        idUtilisateur: newUser.idUtilisateur,
        nom: newUser.nom,
        prenom: newUser.prenom,
        email: newUser.email
      }
    });
  } catch (err) {
    next(err);
  }
}