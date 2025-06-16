const dbPersonnes = require('./db');
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');

exports.getAllComptes = async (req, res) => {
  try {
    const idUtilisateur = req.user.idUtilisateur;
    const fields = req.query.fields;
    const comptes = await dbPersonnes.getAllComptes({
      idUtilisateur,
      fields,
    });
    return res.status(200).json(comptes);
  } catch (error) {
    console.error('Error fetching comptes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.createCompte = async (req, res) => {
  try {
    const { descriptionCompte, nomBanque } = req.body;
    const idUtilisateur = req.user.idUtilisateur;

    // Vérifier si le compte existe déjà
    const existingCompte = await dbPersonnes.getCompteByNom(nomBanque, idUtilisateur);
    if (existingCompte) {
      return res.status(400).json({ message: 'Compte déjà existant' });
    }

    // Créer le compte
    const newCompte = await dbPersonnes.createCompte({
      descriptionCompte,
      nomBanque,
      idUtilisateur,
    });

    return res.status(201).json(newCompte);
  } catch (error) {
    console.error('Error creating compte:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateCompte = async (req, res) => {
  try {
    const { idCompte } = req.params;
    const { descriptionCompte, nomBanque } = req.body;
    const idUtilisateur = req.user.idUtilisateur;

    // Vérifier si le compte existe
    const existingCompte = await dbPersonnes.getCompteById(idCompte);
    if (!existingCompte) {
      return res.status(404).json({ message: 'Compte non trouvé' });
    }

    // Mettre à jour le compte
    const updatedCompte = await dbPersonnes.updateCompte({
      idCompte,
      descriptionCompte,
      nomBanque,
      idUtilisateur,
    });

    return res.status(200).json(updatedCompte);
  } catch (error) {
    console.error('Error updating compte:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.deleteCompte = async (req, res) => {
  try {
    const { idCompte } = req.params;
    const idUtilisateur = req.user.idUtilisateur;

    // Vérifier si le compte existe
    const existingCompte = await dbPersonnes.getCompteById(idCompte);
    if (!existingCompte) {
      return res.status(404).json({ message: 'Compte non trouvé' });
    }

    // Supprimer le compte
    await dbPersonnes.deleteCompte(idCompte, idUtilisateur);

    return res.status(204).json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting compte:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.getVirementsByCompte = async (req, res) => {
  try {
    const { idComptes } = req.params;
    const idUtilisateur = req.user.idUtilisateur;
    const virements = await dbPersonnes.getVirementsByCompte(idComptes, idUtilisateur);
    return res.status(200).json(virements);
  } catch (error) {
    console.error('Error fetching virements by compte:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getVirementsByCompteAndCategorie = async (req, res) => {
  try {
    const { idComptes, idCategorie } = req.params;
    const idUtilisateur = req.user.idUtilisateur;
    const virements = await dbPersonnes.getVirementsByCompteAndCategorie(idComptes, idCategorie, idUtilisateur);
    return res.status(200).json(virements);
  } catch (error) {
    console.error('Error fetching virements by compte and categorie:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getVirementsByCompteCategorieSousCategorie = async (req, res) => {
  try {
    const { idComptes, idCategorie, idSousCategorie } = req.params;
    const idUtilisateur = req.user.idUtilisateur;
    const virements = await dbPersonnes.getVirementsByCompteCategorieSousCategorie(
      idComptes,
      idCategorie,
      idSousCategorie,
      idUtilisateur
    );
    return res.status(200).json(virements);
  } catch (error) {
    console.error('Error fetching virements by compte, categorie and sous-categorie:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};