const { validationResult } = require("express-validator");
const categorieCtrl = require("../../../controllers/categorieController");

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

jest.mock("../../../controllers/categorieController", () => ({
  getAllCategories: jest.fn(),
  createCategorie: jest.fn(),
  updateCategorie: jest.fn(),
  deleteCategorie: jest.fn(),
}));

describe("Categorie Routes", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("GET /categorie - devrait retourner une erreur 400 si les validations échouent", () => {
    req.query = { nom: 123, id: "abc", idAgence: "xyz" };
    validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: "Erreur de validation" }] });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      categorieCtrl.getAllCategories(req, res);
    };

    handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: "Erreur de validation" }] });
  });

  test("GET /categorie - devrait appeler getAllCategories si les validations réussissent", () => {
    req.query = { nom: "Test", id: 1, idAgence: 2 };
    validationResult.mockReturnValue({ isEmpty: () => true });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      categorieCtrl.getAllCategories(req, res);
    };

    handler(req, res);
    expect(categorieCtrl.getAllCategories).toHaveBeenCalledWith(req, res);
  });

  test("POST /categorie - devrait retourner une erreur 400 si les validations échouent", () => {
    req.query = { nom: "", idAgence: "xyz" };
    validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: "Erreur de validation" }] });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      categorieCtrl.createCategorie(req, res);
    };

    handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: "Erreur de validation" }] });
  });

  test("PUT /categorie - devrait appeler updateCategorie si les validations réussissent", () => {
    req.query = { id: 1, nom: "Test" };
    validationResult.mockReturnValue({ isEmpty: () => true });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      categorieCtrl.updateCategorie(req, res);
    };

    handler(req, res);
    expect(categorieCtrl.updateCategorie).toHaveBeenCalledWith(req, res);
  });

  test("DELETE /categorie - devrait retourner une erreur 400 si les validations échouent", () => {
    req.query = { id: "xyz" };
    validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: "Erreur de validation" }] });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      categorieCtrl.deleteCategorie(req, res);
    };

    handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: "Erreur de validation" }] });
  });
});
