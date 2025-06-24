const db = require('../../../routes/comptes/db');
const controller = require('../../../routes/comptes/controller');
const ApiError = require('../../../middlewares/ApiError');
const httpStatusCodes = require('../../../middlewares/httpStatusCodes');

jest.mock('../../../routes/comptes/db');

describe('Compte Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, query: {}, body: {}, user: { idUtilisateur: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      location: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllComptes', () => {
    test('retourne 200 et JSON des comptes quand des comptes existent', async () => {
      const comptes = [{}, {}];
      db.getAllComptes.mockResolvedValue(comptes);

      await controller.getAllComptes(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith(comptes);
    });

    test('appelle next avec ApiError 404 quand aucun compte', async () => {
      db.getAllComptes.mockResolvedValue([]);
      await controller.getAllComptes(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.NOT_FOUND.code);
    });

    test('appelle next avec ApiError 500 en cas d\'erreur', async () => {
      db.getAllComptes.mockRejectedValue(new Error('fail'));
      await controller.getAllComptes(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR.code);
    });
  });

  describe('getCompteById', () => {
    test('retourne 200 et JSON du compte', async () => {
      const compte = { idCompte: 1 };
      db.getCompteById.mockResolvedValue(compte);
      req.params.idCompte = '1';

      await controller.getCompteById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith(compte);
    });

    test('appelle next ApiError 404 si absent', async () => {
      db.getCompteById.mockResolvedValue(null);
      req.params.idCompte = '1';
      await controller.getCompteById(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.NOT_FOUND.code);
    });

    test('appelle next ApiError 500 en cas d\'erreur', async () => {
      db.getCompteById.mockRejectedValue(new Error());
      req.params.idCompte = '1';
      await controller.getCompteById(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });
  });

  describe('createCompte', () => {
    test('retourne 201 et JSON si création réussie', async () => {
      const nouveau = { idCompte: 5, nomBanque: 'B' };
      db.getCompteByNom.mockResolvedValue(null);
      db.createCompte.mockResolvedValue(nouveau);
      req.body = { descriptionCompte: 'x', nomBanque: 'B' };

      await controller.createCompte(req, res, next);

      expect(res.location).toHaveBeenCalledWith('/comptes/5');
      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.CREATED.code);
      expect(res.json).toHaveBeenCalledWith(nouveau);
    });

    test('appelle next 400 si compte existe', async () => {
      db.getCompteByNom.mockResolvedValue({});
      req.body.nomBanque = 'B';
      await controller.createCompte(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(httpStatusCodes.BAD_REQUEST.code);
    });

    test('appelle next 500 si échec création', async () => {
      db.getCompteByNom.mockResolvedValue(null);
      db.createCompte.mockResolvedValue(null);
      req.body = { descriptionCompte: 'x', nomBanque: 'B' };
      await controller.createCompte(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });
  });

  describe('updateCompte', () => {
    test('retourne 200 et JSON si mise à jour réussie', async () => {
      const updated = { idCompte: 3 };
      req.params.idCompte = '3';
      req.body = { descriptionCompte: 'u', nomBanque: 'N' };
      db.getCompteById.mockResolvedValue({});
      db.updateCompte.mockResolvedValue(updated);

      await controller.updateCompte(req, res, next);

      expect(res.location).toHaveBeenCalledWith('/comptes/3');
      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    test('appelle next 404 si absent', async () => {
      db.getCompteById.mockResolvedValue(null);
      req.params.idCompte = '3';
      await controller.updateCompte(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });
  });

  describe('deleteCompte', () => {
    test('retourne 204 et message si suppression réussie', async () => {
      req.params.idCompte = '4';
      db.getCompteById.mockResolvedValue({});
      db.deleteCompte.mockResolvedValue(true);

      await controller.deleteCompte(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.NO_CONTENT.code);
      expect(res.json).toHaveBeenCalledWith({ message: 'Compte supprimé avec succès' });
    });

    test('appelle next 404 si absent', async () => {
      db.getCompteById.mockResolvedValue(null);
      req.params.idCompte = '4';
      await controller.deleteCompte(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });

    test('appelle next 500 si suppression échoue', async () => {
      db.getCompteById.mockResolvedValue({});
      db.deleteCompte.mockResolvedValue(false);
      req.params.idCompte = '4';
      await controller.deleteCompte(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });
  });

  const successArrayEndpoint = (name, dbMethod, paramKeys) => {
    describe(`${name}`, () => {
      test('retourne 200 avec résultats', async () => {
        const data = [{x:1}];
        db[dbMethod].mockResolvedValue(data);
        paramKeys.forEach(k => req.params[k] = '1');

        await controller[name](req, res, next);

        expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
        expect(res.json).toHaveBeenCalledWith(data);
      });
      test('appelle next 404 si résultat null ou undefined', async () => {
        db[dbMethod].mockResolvedValue(undefined);
        paramKeys.forEach(k => req.params[k] = '1');
        await controller[name](req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      });
    });
  };

  successArrayEndpoint('getVirementsByCompte', 'getVirementsByCompte', ['idCompte']);
  successArrayEndpoint('getVirementsByCompteAndCategorie', 'getVirementsByCompteAndCategorie', ['idCompte','idCategorie']);
  successArrayEndpoint('getMouvementsByCompte', 'getMouvementsByCompte', ['idCompte']);
  successArrayEndpoint('getMouvementsByCompteAndCategorie', 'getMouvementsByCompteAndCategorie', ['idCompte','idCategorie']);
  successArrayEndpoint('getMouvementsByCompteCategorieSousCategorie', 'getMouvementsByCompteCategorieSousCategorie', ['idCompte','idCategorie','idSousCategorie']);

  describe('getSoldeByCompte', () => {
    test('retourne 200 avec solde', async () => {
      db.getSoldeByCompte.mockResolvedValue(100);
      req.params.idCompte = '1';
      await controller.getSoldeByCompte(req, res, next);
      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith(100);
    });
    test('appelle next 404 si solde null', async () => {
      db.getSoldeByCompte.mockResolvedValue(null);
      req.params.idCompte = '1';
      await controller.getSoldeByCompte(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    });
  });
});
