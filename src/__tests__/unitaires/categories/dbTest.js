const db = require('../../../config/db');
const categorieDb = require('../../../routes/categories/db'); // adapte le chemin si besoin

jest.mock('../../../config/db', () => ({
  query: jest.fn(),
}));

describe('DB Categories', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    test('devrait retourner toutes les catégories', async () => {
      const mockResult = [{ idCategorie: 1 }, { idCategorie: 2 }];
      db.query.mockImplementation((query, callback) => callback(null, mockResult));

      const result = await categorieDb.getAllCategories({});
      expect(result).toEqual(mockResult);
    });

    test('devrait retourner un tableau vide si aucune catégorie', async () => {
      db.query.mockImplementation((query, callback) => callback(null, []));
      const result = await categorieDb.getAllCategories({});
      expect(result).toEqual([]);
    });
  });

  describe('getCategorieById', () => {
    test('devrait retourner la catégorie si trouvée', async () => {
      const mockResult = [{ idCategorie: 1, nom: 'Alimentation' }];
      db.query.mockImplementation((q, p, cb) => cb(null, mockResult));

      const result = await categorieDb.getCategorieById(1);
      expect(result).toEqual(mockResult[0]);
    });

    test('devrait retourner null si aucune catégorie trouvée', async () => {
      db.query.mockImplementation((q, p, cb) => cb(null, []));
      const result = await categorieDb.getCategorieById(999);
      expect(result).toBeNull();
    });
  });

  describe('getSousCategoriesByCategorieId', () => {
    test('devrait retourner les sous-catégories liées à une catégorie', async () => {
      const mockResult = [{ idSousCategorie: 1 }, { idSousCategorie: 2 }];
      db.query.mockImplementation((q, p, cb) => cb(null, mockResult));

      const result = await categorieDb.getSousCategoriesByCategorieId(1);
      expect(result).toEqual(mockResult);
    });

    test('devrait retourner un tableau vide si aucune sous-catégorie', async () => {
      db.query.mockImplementation((q, p, cb) => cb(null, []));
      const result = await categorieDb.getSousCategoriesByCategorieId(999);
      expect(result).toEqual([]);
    });
  });
});
