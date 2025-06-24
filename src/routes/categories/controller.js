const dbPersonnes = require('./db');
const httpStatusCodes = require('../../middlewares/httpStatusCodes');
const ApiError = require('../../middlewares/ApiError');

exports.getAllCategories = async (req, res, next) => {
  try {
    const idUtilisateur = req.user.idUtilisateur;
    const fields = req.query.fields;
    const categories = await dbPersonnes.getAllCategories({
      idUtilisateur,
      fields,
    });

    return res.status(httpStatusCodes.OK.code).json(categories || []);
    
  } catch (error) {
    // Propagation de l'erreur réelle avec message détaillé
    next(new ApiError(
      httpStatusCodes.INTERNAL_SERVER_ERROR.code,
      `Erreur lors de la récupération des catégories: ${error.message}`,
      error // Détails supplémentaires
    ));
  }
}

exports.getCategorieById = async (req, res, next) => {
  try {
    const idCategorie = req.params.idCategorie;
    const idUtilisateur = req.user.idUtilisateur;
    
    const categorie = await dbPersonnes.getCategorieById(idCategorie, idUtilisateur);
    
    if (!categorie) {
      return next(new ApiError(
        httpStatusCodes.NOT_FOUND.code,
        `Catégorie non trouvée pour l'ID: ${idCategorie}`
      ));
    }
    
    return res.status(httpStatusCodes.OK.code).json(categorie);
    
  } catch (error) {
    next(new ApiError(
      httpStatusCodes.INTERNAL_SERVER_ERROR.code,
      `Erreur lors de la récupération de la catégorie ${req.params.idCategorie}: ${error.message}`,
      error
    ));
  }
}

exports.getSousCategoriesByCategorieId = async (req, res, next) => {
  try {
    const idCategorie = req.params.idCategorie;
    const idUtilisateur = req.user.idUtilisateur;
    
    const sousCategories = await dbPersonnes.getSousCategoriesByCategorieId(idCategorie, idUtilisateur);
    
    // Un tableau vide est une réponse valide (200)
    return res.status(httpStatusCodes.OK.code).json(sousCategories || []);
    
  } catch (error) {
    next(new ApiError(
      httpStatusCodes.INTERNAL_SERVER_ERROR.code,
      `Erreur lors de la récupération des sous-catégories pour la catégorie ${idCategorie}: ${error.message}`,
      error
    ));
  }
}
