const db = require('../../config/db');

exports.getAllTiers = async (idUtilisateur) => {
const query = 'SELECT * FROM Tiers WHERE idUtilisateur = ?';
return new Promise((resolve, reject) => {
    db.query(query, [idUtilisateur], (err, results) => {
        if (err) reject(err);
        resolve(results.length > 0 ? results[0] : null);
    });
});
}
