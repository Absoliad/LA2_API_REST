const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.BDD_HOS, // Adresse de votre base de données
  user: process.env.BDD_USER, // Votre utilisateur MySQL
  password: process.env.BDD_PWD, // Votre mot de passe MySQL
  database: process.env.DATABASE, // Nom de la base de données
});

connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err.stack);
    return;
  }
  console.log("Connecté à la base de données MySQL avec l'ID", connection.threadId);
});

module.exports = connection;
