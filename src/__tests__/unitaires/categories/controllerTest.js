const dbPersonnes = require('../../../routes/categories/db');
const controller = require('../../../routes/categories/controller');
const httpStatusCodes = require('../../../middlewares/httpStatusCodes');
const ApiError = require('../../../middlewares/ApiError');

jest.mock('../../../routes/categories/db');

describe('Categorie Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      user: { idUtilisateur: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    test('retourne 200 avec les catégories', async () => {
      const categories = [{ idCategorie: 1 }, { idCategorie: 2 }];
      dbPersonnes.getAllCategories.mockResolvedValue(categories);

      await controller.getAllCategories(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith(categories);
    });

    test('retourne 200 avec tableau vide si aucune catégorie', async () => {
      dbPersonnes.getAllCategories.mockResolvedValue([]);

      await controller.getAllCategories(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    test('appelle next avec ApiError 500 en cas d\'erreur', async () => {
      dbPersonnes.getAllCategories.mockRejectedValue(new Error('Erreur DB'));

      await controller.getAllCategories(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR.code);
    });
  });

  describe('getCategorieById', () => {
    test('retourne 200 avec la catégorie', async () => {
      const categorie = { idCategorie: 1, nom: 'Alimentation' };
      dbPersonnes.getCategorieById.mockResolvedValue(categorie);
      req.params.idCategorie = '1';

      await controller.getCategorieById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith(categorie);
    });

    test('appelle next avec ApiError 404 si non trouvée', async () => {
      dbPersonnes.getCategorieById.mockResolvedValue(null);
      req.params.idCategorie = '99';

      await controller.getCategorieById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.NOT_FOUND.code);
    });

    test('appelle next avec ApiError 500 en cas d\'erreur', async () => {
      dbPersonnes.getCategorieById.mockRejectedValue(new Error('Erreur'));

      req.params.idCategorie = '1';
      await controller.getCategorieById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR.code);
    });
  });

  describe('getSousCategoriesByCategorieId', () => {
    test('retourne 200 avec sous-catégories', async () => {
      const sousCategories = [{ idSousCategorie: 1 }, { idSousCategorie: 2 }];
      dbPersonnes.getSousCategoriesByCategorieId.mockResolvedValue(sousCategories);
      req.params.idCategorie = '1';

      await controller.getSousCategoriesByCategorieId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith(sousCategories);
    });

    test('retourne 200 avec tableau vide si aucune sous-catégorie', async () => {
      dbPersonnes.getSousCategoriesByCategorieId.mockResolvedValue([]);
      req.params.idCategorie = '1';

      await controller.getSousCategoriesByCategorieId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    test('appelle next avec ApiError 500 si erreur', async () => {
      dbPersonnes.getSousCategoriesByCategorieId.mockRejectedValue(new Error('Erreur DB'));
      req.params.idCategorie = '1';

      await controller.getSousCategoriesByCategorieId(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR.code);
    });
  });
});
