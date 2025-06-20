const db = require("../../../config/db");
const { getAllCategories, createCategorie, updateCategorie, deleteCategorie } = require("../../../services/dbCategories");

jest.mock("../../../config/db", () => ({
  query: jest.fn(),
}));

describe("Service dbCategories", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllCategories", () => {
    test("devrait retourner toutes les catégories lorsque aucun filtre n'est appliqué", async () => {
      const mockResults = [
        { id: 1, nom: "Catégorie 1" },
        { id: 2, nom: "Catégorie 2" },
      ];
      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResults);
      });

      const req = { query: {} };
      await expect(getAllCategories(req)).resolves.toEqual(mockResults);
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM categories", [], expect.any(Function));
    });

    test("devrait retourner les catégories filtrées par nom", async () => {
      const mockResults = [{ id: 1, nom: "Catégorie Test" }];
      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResults);
      });

      const req = { query: { nom: "Test" } };
      await expect(getAllCategories(req)).resolves.toEqual(mockResults);
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM categories WHERE nom LIKE ?", ["%Test%"], expect.any(Function));
    });

    test("devrait retourner une erreur si la requête échoue", async () => {
      const mockError = new Error("Erreur de base de données");
      db.query.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      const req = { query: {} };
      await expect(getAllCategories(req)).rejects.toThrow("Erreur de base de données");
    });
  });
  describe("createCategorie", () => {
    test("devrait créer une catégorie avec succès", async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(null);
      });

      const req = { query: { nom: "Nouvelle Catégorie", idAgence: 1 } };
      await expect(createCategorie(req)).resolves.toBeUndefined();
      expect(db.query).toHaveBeenCalledWith("INSERT INTO categories (nom, idAgence) VALUES (?, ?)", ["Nouvelle Catégorie", 1], expect.any(Function));
    });

    test("devrait rejeter avec une erreur si la requête échoue", async () => {
      const mockError = new Error("Erreur lors de la création");
      db.query.mockImplementation((query, params, callback) => {
        callback(mockError);
      });

      const req = { query: { nom: "Nouvelle Catégorie", idAgence: 1 } };
      await expect(createCategorie(req)).rejects.toThrow("Erreur lors de la création");
    });
  });

  describe("updateCategorie", () => {
    test("devrait mettre à jour une catégorie avec succès", async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(null);
      });

      const req = { query: { id: 1, nom: "Catégorie Modifiée" } };
      await expect(updateCategorie(req)).resolves.toBeUndefined();
      expect(db.query).toHaveBeenCalledWith("UPDATE categories SET nom = ? WHERE id = ?", ["Catégorie Modifiée", 1], expect.any(Function));
    });

    test("devrait rejeter avec une erreur si la requête échoue", async () => {
      const mockError = new Error("Erreur lors de la mise à jour");
      db.query.mockImplementation((query, params, callback) => {
        callback(mockError);
      });

      const req = { query: { id: 1, nom: "Catégorie Modifiée" } };
      await expect(updateCategorie(req)).rejects.toThrow("Erreur lors de la mise à jour");
    });
  });

  describe("deleteCategorie", () => {
    test("devrait supprimer une catégorie avec succès", async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(null);
      });

      const req = { query: { id: 1 } };
      await expect(deleteCategorie(req)).resolves.toBeUndefined();
      expect(db.query).toHaveBeenCalledWith("DELETE FROM categories WHERE id = ?", [1], expect.any(Function));
    });

    test("devrait rejeter avec une erreur si la requête échoue", async () => {
      const mockError = new Error("Erreur lors de la suppression");
      db.query.mockImplementation((query, params, callback) => {
        callback(mockError);
      });

      const req = { query: { id: 1 } };
      await expect(deleteCategorie(req)).rejects.toThrow("Erreur lors de la suppression");
    });
  });
});
