const db = require('../../config/db');

exports.getAllCategories = async (json) => {
    const fields = json.fields || '*';
    const idUtilisateur = json.idUtilisateur || null;

    const query = `
        SELECT ${fields}
        FROM Categorie
        WHERE idUtilisateur = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [idUtilisateur], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results : []);
        });
    });
}

exports.getCategorieById = async (idCategorie, idUtilisateur) => {
    const query = `
        SELECT *
        FROM Categorie
        WHERE idCategorie = ? AND idUtilisateur = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [idCategorie, idUtilisateur], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results[0] : null);
        });
    });
}

exports.getSousCategoriesByCategorieId = async (idCategorie, idUtilisateur) => {
    const query = `
        SELECT *
        FROM SousCategorie
        WHERE idCategorie = ? AND idUtilisateur = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [idCategorie, idUtilisateur], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results : []);
        });
    }
    );
}