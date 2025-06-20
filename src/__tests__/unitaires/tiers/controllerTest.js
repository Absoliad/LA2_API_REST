const dbTiers = require("../../../routes/tiers/db");
const {
  getAllTiers,
  createTiers,
  updateTiers,
  deleteTiers,
} = require("../../../routes/tiers/controller");
const ApiError = require("../../../middlewares/ApiError");
const httpStatusCodes = require("../../../middlewares/httpStatusCodes");

jest.mock("../../../routes/tiers/db");

describe("Tiers Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { idUtilisateur: 1 },
      params: {},
      body: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      location: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => jest.clearAllMocks());

  test("getAllTiers - retourne les tiers avec status 200", async () => {
    const mockTiers = [{ idTiers: 1, nom: "Client 1" }];
    dbTiers.getAllTiers.mockResolvedValue(mockTiers);

    await getAllTiers(req, res, next);

    expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
    expect(res.json).toHaveBeenCalledWith(mockTiers);
    expect(next).not.toHaveBeenCalled();
  });

  test("getAllTiers - appelle next avec erreur Not Found si aucun tiers", async () => {
    const error = new ApiError(httpStatusCodes.NOT_FOUND.code, "Aucun tiers trouvé");
    dbTiers.getAllTiers.mockRejectedValue(error);

    await getAllTiers(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test("createTiers - crée un tiers et retourne status 201", async () => {
    dbTiers.createTiers.mockResolvedValue({ idTiers: 42 });

    req.body = { nom: "Nouveau Client" };
    await createTiers(req, res, next);

    expect(res.status).toHaveBeenCalledWith(httpStatusCodes.CREATED.code);
    expect(res.location).toHaveBeenCalledWith("/tiers/42");
    expect(res.send).toHaveBeenCalled();
  });

  test("createTiers - appelle next avec erreur DuplicateKey si doublon", async () => {
    const error = new ApiError(httpStatusCodes.CONFLICT.code, "Doublon");
    dbTiers.createTiers.mockRejectedValue(error);

    req.body = { nom: "Existant" };
    await createTiers(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test("createTiers - appelle next avec erreur générique sur échec", async () => {
    const error = new ApiError(httpStatusCodes.INTERNAL_SERVER_ERROR.code, "Erreur");
    dbTiers.createTiers.mockRejectedValue(error);

    req.body = { nom: "Client" };
    await createTiers(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test("updateTiers - modifie un tiers et retourne status 204", async () => {
    dbTiers.updateTiers.mockResolvedValue(true);

    req.params = { idTiers: 1 };
    req.body = { nom: "Client Modifié" };
    await updateTiers(req, res, next);

    expect(res.status).toHaveBeenCalledWith(httpStatusCodes.NO_CONTENT.code);
    expect(res.location).toHaveBeenCalledWith("/tiers/1");
    expect(res.send).toHaveBeenCalled();
  });

  test("updateTiers - appelle next avec erreur Not Found si doublon", async () => {
    const error = new ApiError(httpStatusCodes.NOT_FOUND.code, "Tiers non trouvé");
    dbTiers.updateTiers.mockRejectedValue(error);

    req.params = { idTiers: 999 };
    req.body = { nom: "Existant" };
    await updateTiers(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

describe("Tiers Controller - deleteTiers", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      query: {},
      user: { idUtilisateur: 1 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("deleteTiers - supprime un tiers et retourne status 204", async () => {
    dbTiers.deleteTiers.mockResolvedValue(true);

    req.body = { idTiers: 1 };
    await deleteTiers(req, res, next);

    expect(res.status).toHaveBeenCalledWith(httpStatusCodes.NO_CONTENT.code);
    expect(res.send).toHaveBeenCalled();
  });

  test("deleteTiers - appelle next avec erreur Not Found si tiers non trouvé", async () => {
    const error = new ApiError(httpStatusCodes.NOT_FOUND.code, "Tiers non trouvé");
    dbTiers.deleteTiers.mockRejectedValue(error);

    req.body = { idTiers: 999 };
    await deleteTiers(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test("deleteTiers - appelle next avec erreur Bad Request si idTiers invalide", async () => {
    const error = new ApiError(httpStatusCodes.BAD_REQUEST.code, "idTiers doit être un entier positif");
    dbTiers.deleteTiers.mockImplementation(() => {
      throw error;
    });

    req.body = { idTiers: "invalid_id" };
    await deleteTiers(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
  });
});
