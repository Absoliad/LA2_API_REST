const { validationResult } = require("express-validator");
const tiersController = require("../../../routes/tiers/controller");

jest.mock("express-validator");
jest.mock("../../../routes/tiers/controller");

jest.mock('../../../config/db', () => ({
  query: jest.fn(),
}));


describe("Tiers Routes", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  test("GET /tiers - erreur validation", () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Erreur validation" }],
    });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      tiersController.getAllTiers(req, res);
    };

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: "Erreur validation" }] });
  });

  test("GET /tiers - validations OK", () => {
    validationResult.mockReturnValue({ isEmpty: () => true });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      tiersController.getAllTiers(req, res);
    };

    handler(req, res);

    expect(tiersController.getAllTiers).toHaveBeenCalledWith(req, res);
  });

  test("POST /tiers - erreur validation", () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Erreur validation" }],
    });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      tiersController.createTiers(req, res);
    };

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: "Erreur validation" }] });
  });

  test("POST /tiers - validations OK", () => {
    validationResult.mockReturnValue({ isEmpty: () => true });

    const handler = (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      tiersController.createTiers(req, res);
    };

    handler(req, res);

    expect(tiersController.createTiers).toHaveBeenCalledWith(req, res);
  });

  // Tu peux ajouter tests PUT, DELETE similaires
});
