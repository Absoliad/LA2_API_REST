const dbPersonnes = require('./db');
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');
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
    return res.status(httpStatusCodes.OK.code).json(categories);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Error fetching categories'));
  }
}

exports.getCategorieById = async (req, res, next) => {
  try {
    const idCategorie = req.params.idCategorie;
    const idUtilisateur = req.user.idUtilisateur;
    const categorie = await dbPersonnes.getCategorieById(idCategorie, idUtilisateur);
    if (!categorie) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Category not found'));
    }
    return res.status(httpStatusCodes.OK.code).json(categorie);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Error fetching category by ID'));
  }
}

exports.getSousCategoriesByCategorieId = async (req, res, next) => {
  try {
    const idCategorie = req.params.idCategorie;
    const idUtilisateur = req.user.idUtilisateur;
    const sousCategories = await dbPersonnes.getSousCategoriesByCategorieId(idCategorie, idUtilisateur);
    if (!sousCategories || sousCategories.length === 0) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'No sous-categories found for this category'));
    }
    return res.status(httpStatusCodes.OK.code).json(sousCategories);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Error fetching sous-categories by category ID'));
  }
}
