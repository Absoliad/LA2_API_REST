const db = require('../../config/db');

exports.createVirement = async (virement) => {
    const query = 'INSERT INTO Virement (idCompteDebit, idCompteCredit, montant, dateVirement, idTiers, idCategorie) VALUES (?, ?, ?, ?, ?, ?)';
    const { idCompteDebit, idCompteCredit, montant, dateVirement, idTiers, idCategorie } = virement;
    const values = [idCompteDebit, idCompteCredit, montant, dateVirement || null, idTiers || null, idCategorie || null];
    return new Promise((resolve, reject) => {
        db.query(query, values, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

exports.getVirementById = async (id) => {
    const query = 'SELECT * FROM Virement WHERE idVirement = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, results) => {
            if (err) reject(err);
            resolve(results); // Assuming idVirement is unique, we return the first result
        });
    }
    );
}

exports.getAllVirementsByUserId = async (userId) => {
    const query = `
        SELECT v.*, c1.descriptionCompte AS compteDebit, c1.nomBanque AS banqueCompteDebit, c2.descriptionCompte AS compteCredit, c2.nomBanque AS banqueCompteCredit
        FROM Virement v
        JOIN Compte c1 ON v.idCompteDebit = c1.idCompte
        JOIN Compte c2 ON v.idCompteCredit = c2.idCompte
        WHERE c1.idUtilisateur = ? OR c2.idUtilisateur = ?
        ORDER BY v.idVirement DESC
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [userId, userId], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}

exports.deleteVirement = async (id) => {
    const query = 'DELETE FROM Virement WHERE idVirement = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    }
    );
}

exports.updateVirement = async (id, idCategorie) => {
    const query = 'UPDATE Virement SET idCategorie = ? WHERE idVirement = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [idCategorie, id], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}