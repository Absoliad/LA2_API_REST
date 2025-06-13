const db = require("../../config/db");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

exports.login = async (body) => {
    try {
  const { email, password } = body;

  // Validate input
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Simulate user lookup (replace with actual database call) 
  //   const user = await db.query("SELECT * FROM users WHERE email = ?", [email]).then(results => results[0]);
  const user = {   email: "test", pwd: "$argon2id$v=19$m=65536,t=4,p=1$ZGVtbw$eW91clBhc3N3b3Jk" }; // Example user, replace with actual DB query
  if (!user) {
    throw new Error("User not found");
  }

    // Vérifier le mot de passe avec Argon2
    const isValidmdp = await argon2.verify(user.pwd, req.body.pwd);
    if (!isValidmdp) {
      throw new ApiError(400, "Mot de passe incorrect");
    }
    // Générer les tokens
    const accessToken = jwt.sign({ user }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

  // Return user data (omit sensitive information)
  return {accessToken};
    }catch (err) {
    next(err);
  }

}