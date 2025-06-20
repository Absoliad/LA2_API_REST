const dbVirement = require('./db');

exports.createVirement = async (req, res, next) => {
  try {
    const { idCompteDebit, idCompteCredit, montant, dateVirement, idTiers, idCategorie } = req.body;
    
    // Enregistrer l'utilisateur dans la base de données
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
    return res.status(201).json({ 
      message: 'Virement créé avec succès ainsi que les mouvements associés',
      virement: awanewVirement[0]
    });
  } catch (err) {
    next(err);
  }
}

exports.getAllVirements = async (req, res, next) => {
  try {
    const userId = req.user.idUtilisateur; // Assuming user ID is stored in req.user after authentication
    const virements = await dbVirement.getAllVirementsByUserId(userId);
    
    return res.status(200).json(virements);
  } catch (err) {
    next(err);
  }
}

exports.deleteVirement = async (req, res, next) => {
  try {
    const { idVirement } = req.params;
    
    // Vérifier si le virement existe
    const virement = await dbVirement.getVirementById(idVirement);
    if (virement.length === 0) {
      return res.status(404).json({ message: 'Virement non trouvé' });
    }

    // Supprimer le virement
    await dbVirement.deleteVirement(idVirement);
    
    return res.status(200).json({ message: 'Virement supprimé avec succès' });
  } catch (err) {
    next(err);
  }
}

exports.updateVirement = async (req, res, next) => {
  try {
    const { idVirement } = req.params;
    const { idCategorie } = req.body;

    // Vérifier si le virement existe
    const virement = await dbVirement.getVirementById(idVirement);
    if (virement.length === 0) {
      return res.status(404).json({ message: 'Virement non trouvé' });
    }

    // Mettre à jour le virement
    await dbVirement.updateVirement(idVirement, idCategorie );
    
    const updatedVirement = await dbVirement.getVirementById(idVirement);
    res.location(`/virements/${idVirement}`);
    return res.status(200).json({ 
      message: 'Virement mis à jour avec succès',
      virement: updatedVirement[0]
    });
  } catch (err) {
    next(err);
  }
}