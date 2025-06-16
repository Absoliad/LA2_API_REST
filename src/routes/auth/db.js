const db = require('../../config/db');

exports.getPersonneByLogin = async (login) => {
const query = 'SELECT * FROM Utilisateur WHERE login = ?';
return new Promise((resolve, reject) => {
    db.query(query, [login], (err, results) => {
        if (err) reject(err);
        resolve(results.length > 0 ? results[0] : null);
    });
});
}

exports.createPersonne = async (personne) => {
    const query = 'INSERT INTO Utilisateur (nomUtilisateur, prenomUtilisateur, login, mdp, ville, codePostal) VALUES (?, ?, ?, ?, ?, ?)';
    const { nomUtilisateur, prenomUtilisateur, login, password_hash, ville, codePostal } = personne;
    const values = [nomUtilisateur, prenomUtilisateur, login, password_hash, ville || null, codePostal || null];
    return new Promise((resolve, reject) => {
        db.query(query, values, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}