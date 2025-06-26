const dbMouvements = require('../../../routes/mouvements/db');
const controller = require('../../../routes/mouvements/controller');
const httpStatusCodes = require('../../../middlewares/httpStatusCodes');
const ApiError = require('../../../middlewares/ApiError');

jest.mock('../../../routes/mouvements/db');

jest.mock('../../../config/db', () => ({
  query: jest.fn(),
}));


describe('Mouvements Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
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

  describe('getAllMouvements', () => {
    test('retourne 200 avec les mouvements', async () => {
      const mouvements = [{ id: 1 }, { id: 2 }];
      dbMouvements.getAllMouvements.mockResolvedValue(mouvements);

      await controller.getAllMouvements(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith(mouvements);
    });

    test('appelle next avec ApiError 500 en cas d\'erreur', async () => {
      dbMouvements.getAllMouvements.mockRejectedValue(new Error('Erreur'));

      await controller.getAllMouvements(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR.code);
    });
  });

  describe('getMouvementById', () => {
    test('retourne 200 avec le mouvement', async () => {
      const mouvement = { id: 1 };
      dbMouvements.getMouvementById.mockResolvedValue(mouvement);
      req.params.id = '1';

      await controller.getMouvementById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith(mouvement);
    });

    test('appelle next avec ApiError 404 si non trouvé', async () => {
      dbMouvements.getMouvementById.mockResolvedValue(null);
      req.params.id = '99';

      await controller.getMouvementById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.NOT_FOUND.code);
    });

    test('appelle next avec ApiError 500 en cas d\'erreur', async () => {
      dbMouvements.getMouvementById.mockRejectedValue(new Error('Erreur'));
      req.params.id = '1';

      await controller.getMouvementById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR.code);
    });
  });

  describe('addMouvements', () => {
    test('retourne 201 avec le mouvement ajouté', async () => {
      const mouvementData = { idMouvement: 3 };
      const newMouvement = { idMouvement: 3 };
      req.body = mouvementData;
      dbMouvements.getMouvementById.mockResolvedValue(null);
      dbMouvements.addMouvement.mockResolvedValue(newMouvement);

      await controller.addMouvements(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(newMouvement);
    });

    test('retourne 400 si le mouvement existe déjà', async () => {
      req.body = { idMouvement: 1 };
      dbMouvements.getMouvementById.mockResolvedValue({ idMouvement: 1 });

      await controller.addMouvements(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.BAD_REQUEST.code);
    });

    test('appelle next avec ApiError 500 si erreur', async () => {
      req.body = { idMouvement: 4 };
      dbMouvements.getMouvementById.mockRejectedValue(new Error('Erreur'));

      await controller.addMouvements(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR.code);
    });
  });

  describe('deleteMouvements', () => {
    test('retourne 200 si suppression réussie', async () => {
      dbMouvements.deleteMouvement.mockResolvedValue(true);
      req.params.id = '1';

      await controller.deleteMouvements(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith({ message: 'Mouvement supprimé avec succès' });
    });

    test('retourne 404 si mouvement non trouvé', async () => {
      dbMouvements.deleteMouvement.mockResolvedValue(false);
      req.params.id = '99';

      await controller.deleteMouvements(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.NOT_FOUND.code);
    });

    test('appelle next avec ApiError 500 si erreur', async () => {
      dbMouvements.deleteMouvement.mockRejectedValue(new Error('Erreur'));
      req.params.id = '1';

      await controller.deleteMouvements(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR.code);
    });
  });

  describe('patchMouvements', () => {
    test('retourne 200 avec mouvement mis à jour', async () => {
      const updated = { id: 1, nom: 'Nouveau' };
      dbMouvements.patchMouvement.mockResolvedValue(updated);
      req.params.id = '1';
      req.body = { nom: 'Nouveau' };

      await controller.patchMouvements(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    test('retourne 404 si mouvement non trouvé', async () => {
      dbMouvements.patchMouvement.mockResolvedValue(null);
      req.params.id = '1';
      req.body = { nom: 'Nouveau' };

      await controller.patchMouvements(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.NOT_FOUND.code);
    });

    test('appelle next avec ApiError 500 si erreur', async () => {
      dbMouvements.patchMouvement.mockRejectedValue(new Error('Erreur'));
      req.params.id = '1';
      req.body = { nom: 'Nouveau' };

      await controller.patchMouvements(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR.code);
    });
  });
});
