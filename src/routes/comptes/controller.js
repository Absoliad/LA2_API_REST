const dbPersonnes = require('./db');
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');
const ApiError = require('../../middlewares/ApiError');
const httpStatusCodes = require('../../middlewares/httpStatusCodes');

exports.getAllComptes = async (req, res, next) => {
  try {
    const idUtilisateur = req.user.idUtilisateur;
    const fields = req.query.fields;
    const comptes = await dbPersonnes.getAllComptes({
      idUtilisateur,
      fields,
    });
    if (!comptes || comptes.length === 0) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Aucun compte trouvé pour cet utilisateur'));
    }
    return res.status(httpStatusCodes.OK.code).json(comptes);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Erreur lors de la récupération des comptes'));
  }
}

exports.getCompteById = async (req, res, next) => {
  try {
    const { idCompte } = req.params;
    const idUtilisateur = req.user.idUtilisateur;
    const compte = await dbPersonnes.getCompteById(idCompte, idUtilisateur);
    if (!compte) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Compte non trouvé'));
    }
    return res.status(httpStatusCodes.OK.code).json(compte);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Erreur lors de la récupération du compte'));
  }
};

exports.createCompte = async (req, res, next) => {
  try {
    const { descriptionCompte, nomBanque } = req.body;
    const idUtilisateur = req.user.idUtilisateur;

    const existingCompte = await dbPersonnes.getCompteByNom(nomBanque, idUtilisateur);
    if (existingCompte) {
      return next(new ApiError(httpStatusCodes.BAD_REQUEST.code, 'Compte déjà existant'));
    }

    const newCompte = await dbPersonnes.createCompte({
      descriptionCompte,
      nomBanque,
      idUtilisateur,
    });

    if (!newCompte) {
      return next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Erreur lors de la création du compte'));
    }

    res.location(`/comptes/${newCompte.idCompte}`);
    return res.status(httpStatusCodes.CREATED.code).json(newCompte);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Erreur lors de la création du compte'));
  }
};

exports.updateCompte = async (req, res, next) => {
  try {
    const { idCompte } = req.params;
    const { descriptionCompte, nomBanque } = req.body;
    const idUtilisateur = req.user.idUtilisateur;

    const existingCompte = await dbPersonnes.getCompteById(idCompte);
    if (!existingCompte) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Compte non trouvé'));
    }

    const updatedCompte = await dbPersonnes.updateCompte({
      idCompte,
      descriptionCompte,
      nomBanque,
      idUtilisateur,
    });

    res.location(`/comptes/${idCompte}`);
    return res.status(httpStatusCodes.OK.code).json(updatedCompte);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Erreur lors de la mise à jour du compte'));
  }
}

exports.deleteCompte = async (req, res, next) => {
  try {
    const { idCompte } = req.params;
    const idUtilisateur = req.user.idUtilisateur;

    const existingCompte = await dbPersonnes.getCompteById(idCompte);
    if (!existingCompte) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Compte non trouvé'));
    }

    const compte = await dbPersonnes.deleteCompte(idCompte, idUtilisateur);
    if (!compte) {
      return next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Erreur lors de la suppression du compte'));
    }

    return res.status(httpStatusCodes.NO_CONTENT.code).json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Erreur lors de la suppression du compte'));
  }
}

exports.getVirementsByCompte = async (req, res, next) => {
  try {
    const { idCompte } = req.params;
    const idUtilisateur = req.user.idUtilisateur;
    const virements = await dbPersonnes.getVirementsByCompte(idCompte, idUtilisateur);
    if (!virements) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Aucun virement trouvé pour ce compte'));
    }
    return res.status(httpStatusCodes.OK.code).json(virements);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Erreur lors de la récupération des virements'));
  }
};

exports.getVirementsByCompteAndCategorie = async (req, res, next) => {
  try {
    const { idCompte, idCategorie } = req.params;
    const idUtilisateur = req.user.idUtilisateur;
    const virements = await dbPersonnes.getVirementsByCompteAndCategorie(idCompte, idCategorie, idUtilisateur);
    if (!virements) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Aucun virement trouvé pour ce compte et cette catégorie'));
    }
    return res.status(httpStatusCodes.OK.code).json(virements);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Erreur lors de la récupération des virements par catégorie'));
  }
};

exports.getMouvementsByCompteAndCategorie = async (req, res, next) => {
  try {
    const { idCompte, idCategorie } = req.params;
    const idUtilisateur = req.user.idUtilisateur;
    const mouvements = await dbPersonnes.getMouvementsByCompteAndCategorie(idCompte, idCategorie, idUtilisateur);
    if (!mouvements) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Aucun mouvement trouvé pour ce compte et cette catégorie'));
    }
    return res.status(httpStatusCodes.OK.code).json(mouvements);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Erreur lors de la récupération des mouvements par catégorie'));
  }
}

exports.getMouvementsByCompteCategorieSousCategorie = async (req, res, next) => {
  try {
    const { idCompte, idCategorie, idSousCategorie } = req.params;
    const idUtilisateur = req.user.idUtilisateur;
    const mouvements = await dbPersonnes.getMouvementsByCompteCategorieSousCategorie(
      idCompte,
      idCategorie,
      idSousCategorie,
      idUtilisateur
    );
    if (!mouvements) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Aucun mouvement trouvé pour ce compte, catégorie et sous-catégorie'));
    }
    return res.status(httpStatusCodes.OK.code).json(mouvements);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Erreur lors de la récupération des mouvements par sous-catégorie'));
  }
}

exports.getMouvementsByCompte = async (req, res, next) => {
  try {
    const { idCompte } = req.params;
    const idUtilisateur = req.user.idUtilisateur;
    const mouvements = await dbPersonnes.getMouvementsByCompte(idCompte, idUtilisateur);
    if (!mouvements) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Aucun mouvement trouvé pour ce compte'));
    }
    return res.status(httpStatusCodes.OK.code).json(mouvements);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Erreur lors de la récupération des mouvements'));
  }
}

exports.getSoldeByCompte = async (req, res, next) => {
  try {
    const { idCompte } = req.params;
    const idUtilisateur = req.user.idUtilisateur;
    const solde = await dbPersonnes.getSoldeByCompte(idCompte, idUtilisateur);
    if (solde === null) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Solde non trouvé pour ce compte'));
    }
    return res.status(httpStatusCodes.OK.code).json(solde);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Erreur lors de la récupération du solde'));
  }
}
