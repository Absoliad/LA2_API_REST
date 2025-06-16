const jwt = require("jsonwebtoken");

const authenticate = () => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Accès refusé. Token manquant ou mal formé." });
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // On suppose que le payload contient un objet user avec un champ role
      if (!decoded) {
        return res.status(403).json({ message: "Accès interdit : utilisateur ou rôle manquant." });
      }
      req.user = decoded;
      next();
    } catch (err) {
      console.error("Erreur de vérification du token :", err);
      return res.status(401).json({ message: "Token invalide ou expiré." });
    }
  };
};

module.exports = authenticate;
