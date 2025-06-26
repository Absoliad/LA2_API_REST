const dbVirement = require('../../../routes/virements/db');
const controller = require('../../../routes/virements/controller');
const ApiError = require('../../../middlewares/ApiError');
const httpStatusCodes = require('../../../middlewares/httpStatusCodes');

jest.mock('../../../routes/virements/db');

jest.mock('../../../config/db', () => ({
  query: jest.fn(),
}));


describe('Virement Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {}, user: { idUtilisateur: 1 } };
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

  describe('createVirement', () => {
    test('devrait créer un virement et retourner 201', async () => {
      const mockVirement = { insertId: 123 };
      const mockVirementData = [{ id: 123, montant: 100 }];
      req.body = {
        idCompteDebit: 1,
        idCompteCredit: 2,
        montant: 100,
        dateVirement: '2025-01-01',
        idTiers: null,
        idCategorie: null
      };
      dbVirement.createVirement.mockResolvedValue(mockVirement);
      dbVirement.getVirementById.mockResolvedValue(mockVirementData);

      await controller.createVirement(req, res, next);

      expect(res.location).toHaveBeenCalledWith('/virements/123');
      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.CREATED.code);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Virement créé avec succès ainsi que les mouvements associés',
        virement: mockVirementData[0]
      });
    });

    test('devrait appeler next en cas d\'erreur', async () => {
      const error = new Error('Erreur de création');
      dbVirement.createVirement.mockRejectedValue(error);

      await controller.createVirement(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllVirements', () => {
    test('devrait retourner tous les virements de l\'utilisateur', async () => {
      const mockVirements = [{ id: 1 }, { id: 2 }];
      dbVirement.getAllVirementsByUserId.mockResolvedValue(mockVirements);

      await controller.getAllVirements(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith(mockVirements);
    });

    test('devrait appeler next en cas d\'erreur', async () => {
      const error = new Error('Erreur récupération');
      dbVirement.getAllVirementsByUserId.mockRejectedValue(error);

      await controller.getAllVirements(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteVirement', () => {
    test('devrait supprimer un virement et retourner 200', async () => {
      req.params.idVirement = '123';
      dbVirement.getVirementById.mockResolvedValue([{}]);
      dbVirement.deleteVirement.mockResolvedValue();

      await controller.deleteVirement(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith({ message: 'Virement supprimé avec succès' });
    });

    test('devrait appeler next avec ApiError 404 si le virement n\'existe pas', async () => {
      req.params.idVirement = '999';
      dbVirement.getVirementById.mockResolvedValue([]);

      await controller.deleteVirement(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(httpStatusCodes.NOT_FOUND.code);
      expect(error.message).toBe('Virement non trouvé');
    });

    test('devrait appeler next en cas d\'erreur', async () => {
      const error = new Error('Erreur suppression');
      dbVirement.getVirementById.mockRejectedValue(error);

      await controller.deleteVirement(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateVirement', () => {
    test('devrait mettre à jour un virement et retourner 200', async () => {
      req.params.idVirement = '123';
      req.body.idCategorie = 2;
      const updatedVirement = [{ id: 123, idCategorie: 2 }];
      dbVirement.getVirementById
        .mockResolvedValueOnce([{}]) // avant update
        .mockResolvedValueOnce(updatedVirement); // après update
      dbVirement.updateVirement.mockResolvedValue();

      await controller.updateVirement(req, res, next);

      expect(res.location).toHaveBeenCalledWith('/virements/123');
      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Virement mis à jour avec succès',
        virement: updatedVirement[0]
      });
    });

    test('devrait appeler next avec ApiError 404 si le virement n\'existe pas', async () => {
      req.params.idVirement = '999';
      dbVirement.getVirementById.mockResolvedValue([]);

      await controller.updateVirement(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(httpStatusCodes.NOT_FOUND.code);
      expect(error.message).toBe('Virement non trouvé');
    });

    test('devrait appeler next en cas d\'erreur', async () => {
      const error = new Error('Erreur update');
      dbVirement.getVirementById.mockRejectedValue(error);

      await controller.updateVirement(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
