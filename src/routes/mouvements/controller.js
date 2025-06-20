const dbMouvements = require('./db');

exports.getAllMouvements = async (req, res, next) => {
  try {
    const mouvements = await dbMouvements.getAllMouvements();
    return res.status(200).json(mouvements);
  } catch (err) {
    next(err);
  }
};

exports.addMouvements = async (req, res, next) => {
  try {
    const mouvementData = req.body;

    // Vérifier si le mouvement avec idMouvement existe déjà (optionnel, selon logique métier)
    const existingMouvement = await dbMouvements.getMouvementById(mouvementData.idMouvement);
    if (existingMouvement) {
      return res.status(400).json({ message: 'Le mouvement existe déjà' });
    }

    const newMouvement = await dbMouvements.addMouvement(mouvementData);
    return res.status(201).json(newMouvement);
  } catch (err) {
    next(err);
  }
};

exports.deleteMouvements = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await dbMouvements.deleteMouvement(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Mouvement non trouvé' });
    }
    return res.status(200).json({ message: 'Mouvement supprimé avec succès' });
  } catch (err) {
    next(err);
  }
};

exports.patchMouvements = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updateData = req.body;

    const updated = await dbMouvements.patchMouvement(id, updateData);
    if (!updated) {
      return res.status(404).json({ message: 'Mouvement non trouvé' });
    }
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
