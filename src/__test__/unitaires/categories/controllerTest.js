const dbCategories = require("../../../services/dbCategories");
const { getAllCategories, createCategorie, updateCategorie, deleteCategorie } = require("../../../controllers/categorieController");
const { NotFoundError, DuplicateKey } = require("../../../middlewares/errorMiddleware");

jest.mock("../../../services/dbCategories", () => ({
  getAllCategories: jest.fn(),
  createCategorie: jest.fn(),
  updateCategorie: jest.fn(),
  deleteCategorie: jest.fn(),
}));

describe("Categorie Controller", () => {
  let res;
  let next;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn(); // Mock de `next` pour passer l'erreur au middleware
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getAllCategories - devrait retourner toutes les catégories avec un code 200", async () => {
    const mockResults = [
      { id: 1, nom: "Catégorie 1" },
      { id: 2, nom: "Catégorie 2" },
    ];
    dbCategories.getAllCategories.mockResolvedValue(mockResults);

    const req = { query: {} };
    await getAllCategories(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResults);
  });

  test("getAllCategories - devrait retourner 404 si aucune catégorie n'est trouvée", async () => {
    dbCategories.getAllCategories.mockResolvedValue([]);

    const req = { query: {} };
    await getAllCategories(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(NotFoundError)); // Vérifie que `next` est appelé avec l'erreur `NotFoundError`
  });

  test("createCategorie - devrait créer une catégorie et retourner un code 200", async () => {
    dbCategories.createCategorie.mockResolvedValue();

    const req = { query: { nom: "Nouvelle Catégorie", idAgence: 1 } };
    await createCategorie(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("createCategorie - devrait retourner 409 si la catégorie existe déjà", async () => {
    const error = new DuplicateKey("Duplicate key error");
    dbCategories.createCategorie.mockRejectedValue(error);

    const req = { query: { nom: "Existant", idAgence: 1 } };
    await createCategorie(req, res, next);

    expect(next).toHaveBeenCalledWith(error); // Vérifie que `next` est appelé avec l'erreur DuplicateKey
  });

  test("createCategorie - devrait gérer une erreur serveur et retourner un code 500", async () => {
    dbCategories.createCategorie.mockRejectedValue(new Error("Erreur serveur"));

    const req = { query: {} };
    await createCategorie(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error)); // Vérifie que `next` est appelé avec une erreur générique
  });

  test("updateCategorie - devrait modifier une catégorie et retourner un code 200", async () => {
    dbCategories.updateCategorie.mockResolvedValue();

    const req = { query: { id: 1, nom: "Catégorie Modifiée" } };
    await updateCategorie(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("updateCategorie - devrait retourner 409 si la catégorie existe déjà", async () => {
    const error = new DuplicateKey("Duplicate key error");
    dbCategories.updateCategorie.mockRejectedValue(error);

    const req = { query: { id: 1, nom: "Existant" } };
    await updateCategorie(req, res, next);

    expect(next).toHaveBeenCalledWith(error); // Vérifie que `next` est appelé avec l'erreur DuplicateKey
  });

  test("updateCategorie - devrait gérer une erreur serveur et retourner un code 500", async () => {
    dbCategories.updateCategorie.mockRejectedValue(new Error("Erreur serveur"));

    const req = { query: {} };
    await updateCategorie(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error)); // Vérifie que `next` est appelé avec une erreur générique
  });

  test("deleteCategorie - devrait supprimer une catégorie et retourner un code 200", async () => {
    dbCategories.deleteCategorie.mockResolvedValue();

    const req = { query: { id: 1 } };
    await deleteCategorie(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("deleteCategorie - devrait gérer une erreur serveur et retourner un code 500", async () => {
    dbCategories.deleteCategorie.mockRejectedValue(new Error("Erreur serveur"));

    const req = { query: {} };
    await deleteCategorie(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error)); // Vérifie que `next` est appelé avec une erreur générique
  });
});
