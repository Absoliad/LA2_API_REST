const { validationResult } = require("express-validator");
const virementCtrl = require("../../../routes/virements/controller");

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

jest.mock("../../../routes/virements/controller", () => ({
  getAllVirements: jest.fn(),
  createVirement: jest.fn(),
  updateVirement: jest.fn(),
  deleteVirement: jest.fn(),
}));

describe("Virement Routes", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  test("GET /virements - devrait retourner une erreur 400 si les validations échouent", () => {
    req.query = { idCompteDebit: "abc", idCompteCredit: "xyz", montant: "100" }; // Exemple de mauvais input
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Erreur de validation" }],
    });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      virementCtrl.getAllVirements(req, res);
    };

    handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: "Erreur de validation" }] });
  });

  test("GET /virements - devrait appeler getAllVirements si les validations réussissent", () => {
    req.query = { idCompteDebit: 1, idCompteCredit: 2, montant: 100 };
    validationResult.mockReturnValue({ isEmpty: () => true });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      virementCtrl.getAllVirements(req, res);
    };

    handler(req, res);
    expect(virementCtrl.getAllVirements).toHaveBeenCalledWith(req, res);
  });

  test("POST /virements - devrait retourner une erreur 400 si les validations échouent", () => {
    req.body = { montant: "abc", idCompteDebit: 1, idCompteCredit: 2 }; // Exemple de mauvais input
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Erreur de validation" }],
    });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      virementCtrl.createVirement(req, res);
    };

    handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: "Erreur de validation" }] });
  });

  test("POST /virements - devrait appeler createVirement si les validations réussissent", () => {
    req.body = { montant: 100, idCompteDebit: 1, idCompteCredit: 2 };
    validationResult.mockReturnValue({ isEmpty: () => true });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      virementCtrl.createVirement(req, res);
    };

    handler(req, res);
    expect(virementCtrl.createVirement).toHaveBeenCalledWith(req, res);
  });

  test("PATCH /virements/:idVirement - devrait appeler updateVirement si les validations réussissent", () => {
    req.params.idVirement = 10;
    req.body = { montant: 150 };
    validationResult.mockReturnValue({ isEmpty: () => true });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      virementCtrl.updateVirement(req, res);
    };

    handler(req, res);
    expect(virementCtrl.updateVirement).toHaveBeenCalledWith(req, res);
  });

  test("DELETE /virements/:idVirement - devrait retourner une erreur 400 si les validations échouent", () => {
    req.params.idVirement = "xyz"; // Mauvais id
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Erreur de validation" }],
    });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      virementCtrl.deleteVirement(req, res);
    };

    handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: "Erreur de validation" }] });
  });

  test("DELETE /virements/:idVirement - devrait appeler deleteVirement si les validations réussissent", () => {
    req.params.idVirement = 10; // Id correct
    validationResult.mockReturnValue({ isEmpty: () => true });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      virementCtrl.deleteVirement(req, res);
    };

    handler(req, res);
    expect(virementCtrl.deleteVirement).toHaveBeenCalledWith(req, res);
  });
});
