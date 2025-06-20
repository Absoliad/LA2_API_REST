const db = require('../../config/db');

// Récupère tous les tiers d’un utilisateur
exports.getAllTiers = async (idUtilisateur) => {
  const query = 'SELECT * FROM Tiers WHERE idUtilisateur = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [idUtilisateur], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Récupère un tiers par son ID + utilisateur
exports.getTiersById = (idTiers, idUtilisateur) => {
  const query = 'SELECT * FROM Tiers WHERE idTiers = ? AND idUtilisateur = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [idTiers, idUtilisateur], (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0 ? results[0] : null);
    });
  });
};

// Crée un nouveau tiers (sans gérer les dates)
exports.createTiers = (data) => {
  const { nomTiers, idUtilisateur } = data;

  return new Promise((resolve, reject) => {
    const queryCheckUser = 'SELECT 1 FROM Utilisateur WHERE idUtilisateur = ? LIMIT 1';
    db.query(queryCheckUser, [idUtilisateur], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) {
        const error = new Error(`Utilisateur avec id ${idUtilisateur} non trouvé`);
        error.code = 'USER_NOT_FOUND';
        return reject(error);
      }

      const queryInsert = 'INSERT INTO Tiers (nomTiers, idUtilisateur) VALUES (?, ?)';
      db.query(queryInsert, [nomTiers, idUtilisateur], (err2, result) => {
        if (err2) return reject(err2);
        resolve({ idTiers: result.insertId });
      });
    });
  });
};

// Met à jour un tiers (sans modifier les dates)
exports.updateTiers = (idTiers, data) => {
  const fields = [];
  const values = [];

  if (data.nomTiers !== undefined) {
    fields.push('nomTiers = ?');
    values.push(data.nomTiers);
  }

  if (data.idUtilisateur !== undefined) {
    fields.push('idUtilisateur = ?');
    values.push(data.idUtilisateur);
  }

  if (fields.length === 0) {
    return Promise.reject(new Error('Aucun champ à mettre à jour'));
  }

  values.push(idTiers);

  const queryUpdate = `UPDATE Tiers SET ${fields.join(', ')} WHERE idTiers = ?`;

  return new Promise((resolve, reject) => {
    const queryCheck = 'SELECT 1 FROM Tiers WHERE idTiers = ? LIMIT 1';
    db.query(queryCheck, [idTiers], (err, resTiers) => {
      if (err) return reject(err);
      if (resTiers.length === 0) {
        const error = new Error(`Tiers avec id ${idTiers} non trouvé`);
        error.code = 'TIERS_NOT_FOUND';
        return reject(error);
      }

      if (data.idUtilisateur !== undefined) {
        const queryCheckUser = 'SELECT 1 FROM Utilisateur WHERE idUtilisateur = ? LIMIT 1';
        db.query(queryCheckUser, [data.idUtilisateur], (err2, resUser) => {
          if (err2) return reject(err2);
          if (resUser.length === 0) {
            const error = new Error(`Utilisateur avec id ${data.idUtilisateur} non trouvé`);
            error.code = 'USER_NOT_FOUND';
            return reject(error);
          }

          db.query(queryUpdate, values, (err3, result) => {
            if (err3) return reject(err3);
            resolve(result.affectedRows > 0);
          });
        });
      } else {
        db.query(queryUpdate, values, (err3, result) => {
          if (err3) return reject(err3);
          resolve(result.affectedRows > 0);
        });
      }
    });
  });
};

// Supprime un tiers
exports.deleteTiers = (idTiers) => {
  return new Promise((resolve, reject) => {
    const queryCheck = 'SELECT * FROM Tiers WHERE idTiers = ?';
    db.query(queryCheck, [idTiers], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) {
        const error = new Error(`Tiers avec id ${idTiers} non trouvé`);
        error.code = 'TIERS_NOT_FOUND';
        return reject(error);
      }

      const queryDelete = 'DELETE FROM Tiers WHERE idTiers = ?';
      db.query(queryDelete, [idTiers], (err2) => {
        if (err2) return reject(err2);
        resolve();
      });
    });
  });
};
