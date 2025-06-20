const dbPersonnes = require('./db');
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');

exports.getAllCategories = async (req, res) => {
  try {
    const idUtilisateur = req.user.idUtilisateur;
    const fields = req.query.fields;
    const categories = await dbPersonnes.getAllCategories({
      idUtilisateur,
      fields,
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getCategorieById = async (req, res) => {
  try {
    const idCategorie = req.params.idCategorie;
    const idUtilisateur = req.user.idUtilisateur;
    const categorie = await dbPersonnes.getCategorieById(idCategorie, idUtilisateur);
    if (!categorie) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.status(200).json(categorie);
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getSousCategoriesByCategorieId = async (req, res) => {
  try {
    const idCategorie = req.params.idCategorie;
    const idUtilisateur = req.user.idUtilisateur;
    const sousCategories = await dbPersonnes.getSousCategoriesByCategorieId(idCategorie, idUtilisateur);
    return res.status(200).json(sousCategories);
  } catch (error) {
    console.error('Error fetching sous-categories by category ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}