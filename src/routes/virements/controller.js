const dbVirement = require('./db');
const ApiError = require('../../middlewares/ApiError');
const httpStatusCodes = require('../../middlewares/httpStatusCodes');
exports.createVirement = async (req, res, next) => {
  try {
    const { idCompteDebit, idCompteCredit, montant, dateVirement, idTiers, idCategorie } = req.body;

    const newVirement = await dbVirement.createVirement({
      idCompteDebit,
      idCompteCredit,
      montant,
      dateVirement,
      idTiers: idTiers || null,
      idCategorie: idCategorie || null
    });

    const awanewVirement = await dbVirement.getVirementById(newVirement.insertId);
    res.location(`/virements/${newVirement.insertId}`);
    return res.status(httpStatusCodes.CREATED.code).json({
      message: 'Virement créé avec succès ainsi que les mouvements associés',
      virement: awanewVirement[0]
    });
  } catch (err) {
    next(err);
  }
}

exports.getAllVirements = async (req, res, next) => {
  try {
    const userId = req.user.idUtilisateur;
    const virements = await dbVirement.getAllVirementsByUserId(userId);

    return res.status(httpStatusCodes.OK.code).json(virements);
  } catch (err) {
    next(err);
  }
}

exports.deleteVirement = async (req, res, next) => {
  try {
    const { idVirement } = req.params;

    const virement = await dbVirement.getVirementById(idVirement);
    if (virement.length === 0) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Virement non trouvé'));
    }

    await dbVirement.deleteVirement(idVirement);

    return res.status(httpStatusCodes.OK.code).json({ message: 'Virement supprimé avec succès' });
  } catch (err) {
    next(err);
  }
}

exports.updateVirement = async (req, res, next) => {
  try {
    const { idVirement } = req.params;
    const { idCategorie } = req.body;

    const virement = await dbVirement.getVirementById(idVirement);
    if (virement.length === 0) {
      return next(new ApiError(httpStatusCodes.NOT_FOUND.code, 'Virement non trouvé'));
    }

    await dbVirement.updateVirement(idVirement, idCategorie);

    const updatedVirement = await dbVirement.getVirementById(idVirement);
    res.location(`/virements/${idVirement}`);
    return res.status(httpStatusCodes.OK.code).json({
      message: 'Virement mis à jour avec succès',
      virement: updatedVirement[0]
    });
  } catch (err) {
    next(err);
  }
}
