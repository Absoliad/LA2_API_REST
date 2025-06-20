const dbTiers = require('./db');
const ApiError = require('../../middlewares/ApiError');
const httpStatusCodes = require('../../middlewares/httpStatusCodes');
exports.getAllTiers = async (req, res, next) => {
  try {
    const result = await dbTiers.getAllTiers(req.user.idUtilisateur);
    res.status(httpStatusCodes.OK.code).json(result);
  } catch (error) {
    console.error('Erreur getAllTiers :', error);
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, error.message));
  }
};

exports.getTiersById = async (req, res, next) => {
  try {
    const { idTiers } = req.params;
    const result = await dbTiers.getTiersById(idTiers, req.user.idUtilisateur);

    if (!result) {
      throw new ApiError(httpStatusCodes.NOT_FOUND.code, 'Tiers non trouvé');
    }

    res.status(httpStatusCodes.OK.code).json(result);
  } catch (error) {
    console.error('Erreur getTiersById :', error);
    next(error instanceof ApiError ? error : new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, error.message));
  }
};

exports.createTiers = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await dbTiers.createTiers(data);
    if (!result || !result.idTiers) {
      throw new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, 'Erreur lors de la création du tiers');
    }
    res.status(httpStatusCodes.CREATED.code).location(`/tiers/${result.idTiers}`).send();
  } catch (error) {
    console.error('Erreur createTiers :', error);

    if (error.code === 'USER_NOT_FOUND') {
      return next(new ApiError(httpStatusCodes.NOT_FOUND, error.message));
    }

    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

exports.deleteTiers = async (req, res, next) => {
  try {
    const idTiers = parseInt(req.body.idTiers || req.query.idTiers, 10);

    if (isNaN(idTiers) || idTiers <= 0) {
      throw new ApiError(httpStatusCodes.BAD_REQUEST, 'idTiers doit être un entier positif');
    }

    const result = await dbTiers.deleteTiers(idTiers);
    if (!result) {
      throw new ApiError(httpStatusCodes.NOT_FOUND, 'Tiers non trouvé');
    }

    res.status(httpStatusCodes.NO_CONTENT.code).send();
  } catch (error) {
    console.error('Erreur deleteTiers :', error);

    if (error.code === 'TIERS_NOT_FOUND') {
      return next(new ApiError(httpStatusCodes.NOT_FOUND, error.message));
    }

    next(error instanceof ApiError ? error : new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

exports.updateTiers = async (req, res, next) => {
  try {
    const idTiers = parseInt(req.params.idTiers, 10);
    if (isNaN(idTiers) || idTiers <= 0) {
      throw new ApiError(httpStatusCodes.BAD_REQUEST, 'idTiers doit être un entier positif');
    }

    const data = req.body;
    const result = await dbTiers.updateTiers(idTiers, data);

    if (!result) {
      throw new ApiError(httpStatusCodes.NOT_FOUND, 'Tiers non trouvé');
    }

    res.status(httpStatusCodes.NO_CONTENT.code).location(`/tiers/${idTiers}`).send();
  } catch (error) {
    console.error('Erreur updateTiers :', error);

    if (error.code === 'USER_NOT_FOUND' || error.code === 'TIERS_NOT_FOUND') {
      return next(new ApiError(httpStatusCodes.NOT_FOUND, error.message));
    }

    if (error.message === 'Aucun champ à mettre à jour') {
      return next(new ApiError(httpStatusCodes.BAD_REQUEST, error.message));
    }

    next(error instanceof ApiError ? error : new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};
