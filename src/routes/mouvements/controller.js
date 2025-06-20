const dbMouvements = require('./db');
const ApiError = require('../../middlewares/ApiError');
const httpStatusCodes = require('../../middlewares/httpStatusCodes');

exports.getAllMouvements = async (req, res, next) => {
  try {
    const mouvements = await dbMouvements.getAllMouvements();
    return res.status(httpStatusCodes.OK.code).json(mouvements);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, error.message));
  }
};

exports.getMouvementById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const mouvement = await dbMouvements.getMouvementById(id);
    if (!mouvement) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Mouvement non trouvé'));
    }
    return res.status(httpStatusCodes.OK.code).json(mouvement);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, error.message));
  }
};

exports.addMouvements = async (req, res, next) => {
  try {
    const mouvementData = req.body;

    const existingMouvement = await dbMouvements.getMouvementById(mouvementData.idMouvement);
    if (existingMouvement) {
      return next(new ApiError(httpStatusCodes.BAD_REQUEST.code, 'Le mouvement existe déjà'));
    }

    const newMouvement = await dbMouvements.addMouvement(mouvementData);
    return res.status(httpStatusCodes.CREATED).json(newMouvement);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, error.message));
  }
};

exports.deleteMouvements = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await dbMouvements.deleteMouvement(id);
    if (!deleted) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Mouvement non trouvé'));
    }
    return res.status(httpStatusCodes.OK.code).json({ message: 'Mouvement supprimé avec succès' });
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, error.message));
  }
};

exports.patchMouvements = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updateData = req.body;

    const updated = await dbMouvements.patchMouvement(id, updateData);
    if (!updated) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Mouvement non trouvé'));
    }
    return res.status(httpStatusCodes.OK.code).json(updated);
  } catch (error) {
    next(new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, error.message));

  }
};
