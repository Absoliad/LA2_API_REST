const db = require('../../../config/db');
const mouvementDb = require('../../../routes/mouvements/db'); // adapte si besoin

jest.mock('../../../config/db', () => ({
  query: jest.fn(),
}));

describe('DB Mouvements', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllMouvements', () => {
    test('devrait retourner tous les mouvements', async () => {
      const mockResult = [{ idMouvement: 1 }, { idMouvement: 2 }];
      db.query.mockImplementation((q, cb) => cb(null, mockResult));

      const result = await mouvementDb.getAllMouvements();
      expect(result).toEqual(mockResult);
    });

    test('devrait retourner une erreur si requête échoue', async () => {
      db.query.mockImplementation((q, cb) => cb(new Error('Erreur DB')));
      await expect(mouvementDb.getAllMouvements()).rejects.toThrow('Erreur DB');
    });
  });

  describe('getMouvementById', () => {
    test('devrait retourner un mouvement existant', async () => {
      const mockResult = [{ idMouvement: 1, montant: 100 }];
      db.query.mockImplementation((q, p, cb) => cb(null, mockResult));

      const result = await mouvementDb.getMouvementById(1);
      expect(result).toEqual(mockResult[0]);
    });

    test('devrait retourner null si le mouvement n\'existe pas', async () => {
      db.query.mockImplementation((q, p, cb) => cb(null, []));
      const result = await mouvementDb.getMouvementById(999);
      expect(result).toBeNull();
    });

    test('devrait gérer une erreur de base de données', async () => {
      db.query.mockImplementation((q, p, cb) => cb(new Error('Erreur DB')));
      await expect(mouvementDb.getMouvementById(1)).rejects.toThrow('Erreur DB');
    });
  });

  describe('addMouvement', () => {
    test('devrait insérer un mouvement et le retourner', async () => {
      const mouvement = {
        idMouvement: 3,
        dateMouvement: '2024-01-01',
        idCompte: 1,
        idTiers: null,
        idCategorie: null,
        idSousCategorie: null,
        idVirement: null,
        montant: 150,
        typeMouvement: 'credit',
      };
      db.query.mockImplementation((q, v, cb) => cb(null, { insertId: 3 }));

      const result = await mouvementDb.addMouvement(mouvement);
      expect(result).toEqual({ idMouvement: 3, ...mouvement });
    });

    test('devrait gérer une erreur lors de l\'insertion', async () => {
      db.query.mockImplementation((q, v, cb) => cb(new Error('Erreur insertion')));
      await expect(mouvementDb.addMouvement({ idMouvement: 1 })).rejects.toThrow('Erreur insertion');
    });
  });

  describe('deleteMouvement', () => {
    test('devrait retourner true si un mouvement est supprimé', async () => {
      db.query.mockImplementation((q, v, cb) => cb(null, { affectedRows: 1 }));
      const result = await mouvementDb.deleteMouvement(1);
      expect(result).toBe(true);
    });

    test('devrait retourner false si aucun mouvement supprimé', async () => {
      db.query.mockImplementation((q, v, cb) => cb(null, { affectedRows: 0 }));
      const result = await mouvementDb.deleteMouvement(999);
      expect(result).toBe(false);
    });

    test('devrait gérer une erreur lors de la suppression', async () => {
      db.query.mockImplementation((q, v, cb) => cb(new Error('Erreur suppression')));
      await expect(mouvementDb.deleteMouvement(1)).rejects.toThrow('Erreur suppression');
    });
  });

  describe('patchMouvement', () => {
    test('devrait mettre à jour un mouvement existant', async () => {
      const id = 1;
      const updateData = { montant: 200 };
      const mockUpdated = { idMouvement: 1, montant: 200 };

      db.query
        .mockImplementationOnce((q, v, cb) => cb(null, { affectedRows: 1 })) // update
        .mockImplementationOnce((q, v, cb) => cb(null, [mockUpdated])); // get by id

      const result = await mouvementDb.patchMouvement(id, updateData);
      expect(result).toEqual(mockUpdated);
    });

    test('devrait retourner null si aucun champ à mettre à jour', async () => {
      const result = await mouvementDb.patchMouvement(1, {});
      expect(result).toBeNull();
    });

    test('devrait retourner null si aucun mouvement mis à jour', async () => {
      db.query.mockImplementation((q, v, cb) => cb(null, { affectedRows: 0 }));
      const result = await mouvementDb.patchMouvement(999, { montant: 100 });
      expect(result).toBeNull();
    });

    test('devrait gérer une erreur SQL', async () => {
      db.query.mockImplementation((q, v, cb) => cb(new Error('Erreur update')));
      await expect(mouvementDb.patchMouvement(1, { montant: 100 })).rejects.toThrow('Erreur update');
    });
  });
});
