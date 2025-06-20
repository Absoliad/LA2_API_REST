const db = require('../../config/db');

exports.getAllMouvements = async () => {
  const query = 'SELECT * FROM Mouvement';
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

exports.getMouvementById = async (idMouvement) => {
  const query = 'SELECT * FROM Mouvement WHERE idMouvement = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [idMouvement], (err, results) => {
      if (err) reject(err);
      else resolve(results.length > 0 ? results[0] : null);
    });
  });
};

exports.addMouvement = async (mouvement) => {
  const {idMouvement, dateMouvement, idCompte, idTiers, idCategorie, idSousCategorie, idVirement, montant, typeMouvement} = mouvement;
  const query = `INSERT INTO Mouvement
    (idMouvement, dateMouvement, idCompte, idTiers, idCategorie, idSousCategorie, idVirement, montant, typeMouvement)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [idMouvement, dateMouvement, idCompte, idTiers || null, idCategorie || null, idSousCategorie || null, idVirement || null, montant, typeMouvement];
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, results) => {
      if (err) reject(err);
      else resolve({ idMouvement, ...mouvement });
    });
  });
};

exports.deleteMouvement = async (idMouvement) => {
  const query = 'DELETE FROM Mouvement WHERE idMouvement = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [idMouvement], (err, results) => {
      if (err) reject(err);
      else resolve(results.affectedRows > 0);
    });
  });
};

exports.patchMouvement = async (idMouvement, updateData) => {
  // Construire dynamiquement la requête UPDATE selon les champs à mettre à jour
  const fields = [];
  const values = [];
  for (const key in updateData) {
    fields.push(`${key} = ?`);
    values.push(updateData[key]);
  }
  if (fields.length === 0) {
    return null; // Rien à mettre à jour
  }
  const query = `UPDATE Mouvement SET ${fields.join(', ')} WHERE idMouvement = ?`;
  values.push(idMouvement);

  return new Promise((resolve, reject) => {
    db.query(query, values, async (err, results) => {
      if (err) reject(err);
      else {
        if (results.affectedRows === 0) {
          resolve(null); // Mouvement non trouvé
        } else {
          // Retourner le mouvement mis à jour
          const updated = await exports.getMouvementById(idMouvement);
          resolve(updated);
        }
      }
    });
  });
};
