const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config(); // Charge les variables d'environnement depuis le fichier .env
const connection = mysql.createConnection({
  host: process.env.BDD_HOST, // Adresse de votre base de données
  user: process.env.BDD_USER, // Votre utilisateur MySQL
  password: process.env.BDD_PWD, // Votre mot de passe MySQL
  database: process.env.DATABASE, // Nom de la base de données
  port: process.env.BDD_PORT, // Port de la base de données, par défaut 3306
});

connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err.stack);
    return;
  }
  console.log("Connecté à la base de données MySQL avec l'ID", connection.threadId);
});

module.exports = connection;
