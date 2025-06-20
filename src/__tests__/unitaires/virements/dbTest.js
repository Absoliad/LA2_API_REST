const db = require('../../../config/db');
const {
  createVirement,
  getVirementById,
  getAllVirementsByUserId,
  deleteVirement,
  updateVirement,
} = require('../../../routes/virements/db');

jest.mock('../../../config/db', () => ({
  query: jest.fn(),
}));

describe('Service dbVirement', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createVirement', () => {
    test('devrait créer un virement avec succès', async () => {
      const mockResult = { insertId: 1 };
      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const virement = {
        idCompteDebit: 1,
        idCompteCredit: 2,
        montant: 100,
        dateVirement: '2025-01-01',
        idTiers: null,
        idCategorie: 3
      };

      await expect(createVirement(virement)).resolves.toEqual(mockResult);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO Virement'),
        [1, 2, 100, '2025-01-01', null, 3],
        expect.any(Function)
      );
    });

    test('devrait rejeter avec une erreur si la requête échoue', async () => {
      const error = new Error('Erreur SQL');
      db.query.mockImplementation((query, params, callback) => {
        callback(error, null);
      });

      await expect(createVirement({})).rejects.toThrow('Erreur SQL');
    });
  });

  describe('getVirementById', () => {
    test('devrait retourner le virement avec l\'id donné', async () => {
      const mockResult = [{ idVirement: 1, montant: 100 }];
      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      await expect(getVirementById(1)).resolves.toEqual(mockResult);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM Virement WHERE idVirement = ?',
        [1],
        expect.any(Function)
      );
    });

    test('devrait rejeter si la requête échoue', async () => {
      const error = new Error('Erreur lecture');
      db.query.mockImplementation((query, params, callback) => {
        callback(error, null);
      });

      await expect(getVirementById(1)).rejects.toThrow('Erreur lecture');
    });
  });

  describe('getAllVirementsByUserId', () => {
    test('devrait retourner les virements liés à l\'utilisateur', async () => {
      const mockResults = [{ idVirement: 1 }, { idVirement: 2 }];
      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResults);
      });

      await expect(getAllVirementsByUserId(5)).resolves.toEqual(mockResults);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT v.*,'),
        [5, 5],
        expect.any(Function)
      );
    });

    test('devrait rejeter en cas d\'erreur', async () => {
      const error = new Error('Erreur SQL');
      db.query.mockImplementation((query, params, callback) => {
        callback(error, null);
      });

      await expect(getAllVirementsByUserId(5)).rejects.toThrow('Erreur SQL');
    });
  });

  describe('deleteVirement', () => {
    test('devrait supprimer un virement avec succès', async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      await expect(deleteVirement(10)).resolves.toEqual({ affectedRows: 1 });
      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM Virement WHERE idVirement = ?',
        [10],
        expect.any(Function)
      );
    });

    test('devrait échouer si la requête échoue', async () => {
      const error = new Error('Erreur suppression');
      db.query.mockImplementation((query, params, callback) => {
        callback(error, null);
      });

      await expect(deleteVirement(10)).rejects.toThrow('Erreur suppression');
    });
  });

  describe('updateVirement', () => {
    test('devrait mettre à jour un virement avec succès', async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      await expect(updateVirement(10, 3)).resolves.toEqual({ affectedRows: 1 });
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE Virement SET idCategorie = ? WHERE idVirement = ?',
        [3, 10],
        expect.any(Function)
      );
    });

    test('devrait échouer si la requête échoue', async () => {
      const error = new Error('Erreur mise à jour');
      db.query.mockImplementation((query, params, callback) => {
        callback(error, null);
      });

      await expect(updateVirement(10, 3)).rejects.toThrow('Erreur mise à jour');
    });
  });
});
