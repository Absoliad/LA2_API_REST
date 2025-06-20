const dbTiers = require('./db');

exports.getAllTiers = async (req, res) => {
  try {
    const result = await dbTiers.getAllTiers(req.user.idUtilisateur);
    res.status(200).json(result);
  } catch (error) {
    console.error('Erreur getAllTiers :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getTiersById = async (req, res) => {
  try {
    const { idTiers } = req.params;
    const result = await dbTiers.getTiersById(idTiers, req.user.idUtilisateur);

    if (!result) {
      return res.status(404).json({ error: 'Tiers non trouvé' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Erreur getTiersById :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createTiers = async (req, res) => {
  try {
    const data = req.body;
    const result = await dbTiers.createTiers(data);

    res.status(201).location(`/tiers/${result.idTiers}`).send();
  } catch (error) {
    console.error('Erreur createTiers :', error);

    if (error.code === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteTiers = async (req, res) => {
  try {
    const idTiers = parseInt(req.body.idTiers || req.query.idTiers, 10);

    if (isNaN(idTiers) || idTiers <= 0) {
      return res.status(400).json({ error: 'idTiers doit être un entier positif' });
    }

    await dbTiers.deleteTiers(idTiers);

    res.status(204).send();
  } catch (error) {
    console.error('Erreur deleteTiers :', error);

    if (error.code === 'TIERS_NOT_FOUND') {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updateTiers = async (req, res) => {
  try {
    const idTiers = parseInt(req.params.idTiers, 10);
    if (isNaN(idTiers) || idTiers <= 0) {
      return res.status(400).json({ error: 'idTiers doit être un entier positif' });
    }

    const data = req.body;
    const result = await dbTiers.updateTiers(idTiers, data);

    if (!result) {
      return res.status(404).json({ error: 'Tiers non trouvé' });
    }

    res.status(204).location(`/tiers/${idTiers}`).send();
  } catch (error) {
    console.error('Erreur updateTiers :', error);

    if (error.code === 'USER_NOT_FOUND' || error.code === 'TIERS_NOT_FOUND') {
      return res.status(404).json({ error: error.message });
    }

    if (error.message === 'Aucun champ à mettre à jour') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Erreur serveur' });
  }
};
