const db = require('../../config/db');

exports.getAllCategories = async (json) => {
    const fields = json.fields || '*';

    const query = `
        SELECT ${fields}
        FROM Categorie
    `;
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results : []);
        });
    });
}

exports.getCategorieById = async (idCategorie) => {
    const query = `
        SELECT *
        FROM Categorie
        WHERE idCategorie = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [idCategorie], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results[0] : null);
        });
    });
}

exports.getSousCategoriesByCategorieId = async (idCategorie) => {
    const query = `
        SELECT *
        FROM SousCategorie
        WHERE idCategorie = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [idCategorie], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results : []);
        });
    });
}
