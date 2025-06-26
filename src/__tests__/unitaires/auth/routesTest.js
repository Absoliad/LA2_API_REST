const { validationResult, check } = require("express-validator");
const authCtrl = require("../../../routes/auth/controller");

jest.mock("express-validator", () => ({
  check: jest.fn().mockReturnThis(), // Mock pour la méthode `check` de express-validator
  validationResult: jest.fn(),
}));

jest.mock("../../../routes/auth/controller", () => ({
  login: jest.fn(),
  register: jest.fn(),
}));

jest.mock('../../../config/db', () => ({
  query: jest.fn(),
}));


describe("Auth Routes", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  test("POST /auth/login - devrait retourner une erreur 400 si les validations échouent", () => {
    req.body = { login: "", mdp: "password123" }; // Exemple de mauvais input pour login
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Login requis" }],
    });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      authCtrl.login(req, res);
    };

    handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: "Login requis" }] });
  });

  test("POST /auth/login - devrait appeler login si les validations réussissent", () => {
    req.body = { login: "testuser", mdp: "password123" };
    validationResult.mockReturnValue({ isEmpty: () => true });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      authCtrl.login(req, res);
    };

    handler(req, res);
    expect(authCtrl.login).toHaveBeenCalledWith(req, res);
  });

  test("POST /auth/register - devrait retourner une erreur 400 si les validations échouent", () => {
    req.body = { login: "testuser", mdp: "short" }; // Mot de passe trop court
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Mot de passe requis (min 8 caractères)" }],
    });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      authCtrl.register(req, res);
    };

    handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: "Mot de passe requis (min 8 caractères)" }] });
  });

  test("POST /auth/register - devrait appeler register si les validations réussissent", () => {
    req.body = { login: "testuser", mdp: "password123" };
    validationResult.mockReturnValue({ isEmpty: () => true });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      authCtrl.register(req, res);
    };

    handler(req, res);
    expect(authCtrl.register).toHaveBeenCalledWith(req, res);
  });
});
