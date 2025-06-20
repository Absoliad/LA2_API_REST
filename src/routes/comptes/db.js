const db = require('../../config/db');

exports.getAllComptes = async (json) => {
    const fields = json.fields || '*';
    const idUtilisateur = json.idUtilisateur || null;

    const query = `
        SELECT ${fields}
        FROM Compte
        WHERE idUtilisateur = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [idUtilisateur], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results : null);
        });
    });
}

exports.getCompteByNom = async (nomBanque, idUtilisateur) => {
    const query = `
        SELECT *
        FROM Compte
        WHERE nomBanque = ? AND idUtilisateur = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [nomBanque, idUtilisateur], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results[0] : null);
        });
    });
}

exports.createCompte = async (json) => {
    const { nomBanque, descriptionCompte, idUtilisateur } = json;

    const query = `
        INSERT INTO Compte (nomBanque, descriptionCompte, idUtilisateur)
        VALUES (?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [nomBanque, descriptionCompte, idUtilisateur], (err, results) => {
            if (err) return reject(err);
            resolve({
                idCompte: results.insertId,
                nomBanque,
                idUtilisateur
            });
        });
    });
}

exports.updateCompte = async (json) => {
    const { idCompte, nomBanque, descriptionCompte, idUtilisateur } = json;

    const query = `
        UPDATE Compte
        SET nomBanque = ?, descriptionCompte = ?
        WHERE idCompte = ? AND idUtilisateur = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [nomBanque, descriptionCompte, idCompte, idUtilisateur], (err, results) => {
            if (err) return reject(err);
            resolve(results.affectedRows > 0);
        });
    });
}

exports.getCompteById = async (idCompte) => {
    const query = `
        SELECT *
        FROM Compte
        WHERE idCompte = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [idCompte], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results[0] : null);
        });
    });
}

exports.deleteCompte = async (idCompte) => {
    const query = `
        DELETE FROM Compte
        WHERE idCompte = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [idCompte], (err, results) => {
            if (err) return reject(err);
            resolve(results.affectedRows > 0);
        });
    });
}

exports.getVirementsByCompte = async (idCompte) => {
    const query = `
        SELECT *
        FROM Virement
        WHERE idCompteCredit = ? OR idCompteDebit = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [idCompte, idCompte], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.getVirementsByCompteAndCategorie = async (idCompte, idCategorie) => {
    const query = `
        SELECT v.*
        FROM Virement v
        JOIN Categorie c ON v.idCategorie = c.idCategorie
        WHERE (v.idCompteCredit = ? OR v.idCompteDebit = ?) AND v.idCategorie = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [idCompte, idCompte, idCategorie], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};


exports.getMouvementsByCompteAndCategorie = async (idCompte, idCategorie) => {
    const query = `
        SELECT m.*
        FROM Mouvement m
        JOIN Categorie c ON m.idCategorie = c.idCategorie
        WHERE m.idCompte = ? AND m.idCategorie = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [idCompte, idCategorie], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.getMouvementsByCompteCategorieSousCategorie = async (idCompte, idCategorie, idSousCategorie) => {
    const query = `
        SELECT m.*
        FROM Mouvement m
        JOIN Categorie c ON m.idCategorie = c.idCategorie
        JOIN SousCategorie sc ON m.idSousCategorie = sc.idSousCategorie
        WHERE m.idCompte = ? AND m.idCategorie = ? AND m.idSousCategorie = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [idCompte, idCategorie, idSousCategorie], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

exports.getMouvementsByCompte = async (idCompte) => {
    const query = `
        SELECT *
        FROM Mouvement
        WHERE idCompte = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [idCompte], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

exports.getSoldeByCompte = async (idCompte) => {
    const query = `
        SELECT SUM(m.montant) AS solde
        FROM Mouvement m
        WHERE m.idCompte = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [idCompte], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results[0].solde : 0);
        });
    });
}