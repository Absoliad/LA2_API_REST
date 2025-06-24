const db = require('../../../config/db');
const comptesDb = require('../../../routes/comptes/db');

jest.mock('../../../config/db', () => ({
  query: jest.fn(),
}));

describe('DB Comptes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllComptes', () => {
    test('devrait retourner tous les comptes', async () => {
      const mockResult = [{ idCompte: 1 }, { idCompte: 2 }];
      db.query.mockImplementation((query, params, callback) => callback(null, mockResult));

      const result = await comptesDb.getAllComptes({ idUtilisateur: 1 });
      expect(result).toEqual(mockResult);
    });

    test('devrait retourner null si aucun compte', async () => {
      db.query.mockImplementation((query, params, callback) => callback(null, []));
      const result = await comptesDb.getAllComptes({ idUtilisateur: 1 });
      expect(result).toBeNull();
    });
  });

  describe('getCompteByNom', () => {
    test('devrait retourner un compte existant', async () => {
      const mockResult = [{ idCompte: 1, nomBanque: 'BNC' }];
      db.query.mockImplementation((q, p, cb) => cb(null, mockResult));

      const result = await comptesDb.getCompteByNom('BNC', 2);
      expect(result).toEqual(mockResult[0]);
    });
  });

  describe('createCompte', () => {
    test('devrait créer un compte', async () => {
      const mockResult = { insertId: 10 };
      db.query.mockImplementation((q, p, cb) => cb(null, mockResult));

      const data = { nomBanque: 'BNC', descriptionCompte: 'Compte courant', idUtilisateur: 1 };
      const result = await comptesDb.createCompte(data);
      expect(result).toEqual({ idCompte: 10, nomBanque: 'BNC', idUtilisateur: 1 });
    });
  });

  describe('updateCompte', () => {
    test('devrait mettre à jour un compte existant', async () => {
      db.query.mockImplementation((q, p, cb) => cb(null, { affectedRows: 1 }));
      const result = await comptesDb.updateCompte({
        idCompte: 1,
        nomBanque: 'Nouvelle Banque',
        descriptionCompte: 'Nouveau descriptif',
        idUtilisateur: 2,
      });
      expect(result).toBe(true);
    });
  });

  describe('getCompteById', () => {
    test('devrait retourner un compte par son ID', async () => {
      const mock = [{ idCompte: 5 }];
      db.query.mockImplementation((q, p, cb) => cb(null, mock));
      const result = await comptesDb.getCompteById(5);
      expect(result).toEqual(mock[0]);
    });
  });

  describe('deleteCompte', () => {
    test('devrait supprimer un compte', async () => {
      db.query.mockImplementation((q, p, cb) => cb(null, { affectedRows: 1 }));
      const result = await comptesDb.deleteCompte(3);
      expect(result).toBe(true);
    });
  });

  describe('getVirementsByCompte', () => {
    test('devrait retourner les virements liés au compte', async () => {
      const mock = [{ idVirement: 1 }, { idVirement: 2 }];
      db.query.mockImplementation((q, p, cb) => cb(null, mock));
      const result = await comptesDb.getVirementsByCompte(1);
      expect(result).toEqual(mock);
    });
  });

  describe('getVirementsByCompteAndCategorie', () => {
    test('devrait retourner les virements pour un compte et une catégorie', async () => {
      const mock = [{ idVirement: 9 }];
      db.query.mockImplementation((q, p, cb) => cb(null, mock));
      const result = await comptesDb.getVirementsByCompteAndCategorie(1, 2);
      expect(result).toEqual(mock);
    });
  });

  describe('getMouvementsByCompteAndCategorie', () => {
    test('devrait retourner les mouvements du compte et catégorie', async () => {
      const mock = [{ idMouvement: 1 }];
      db.query.mockImplementation((q, p, cb) => cb(null, mock));
      const result = await comptesDb.getMouvementsByCompteAndCategorie(1, 2);
      expect(result).toEqual(mock);
    });
  });

  describe('getMouvementsByCompteCategorieSousCategorie', () => {
    test('devrait retourner les mouvements avec sous-catégorie', async () => {
      const mock = [{ idMouvement: 3 }];
      db.query.mockImplementation((q, p, cb) => cb(null, mock));
      const result = await comptesDb.getMouvementsByCompteCategorieSousCategorie(1, 2, 3);
      expect(result).toEqual(mock);
    });
  });

  describe('getMouvementsByCompte', () => {
    test('devrait retourner les mouvements du compte', async () => {
      const mock = [{ idMouvement: 99 }];
      db.query.mockImplementation((q, p, cb) => cb(null, mock));
      const result = await comptesDb.getMouvementsByCompte(5);
      expect(result).toEqual(mock);
    });
  });

  describe('getSoldeByCompte', () => {
    test('devrait retourner le solde du compte', async () => {
      const mock = [{ solde: 1500 }];
      db.query.mockImplementation((q, p, cb) => cb(null, mock));
      const result = await comptesDb.getSoldeByCompte(7);
      expect(result).toEqual(1500);
    });

    test('devrait retourner 0 si aucun résultat', async () => {
      db.query.mockImplementation((q, p, cb) => cb(null, []));
      const result = await comptesDb.getSoldeByCompte(7);
      expect(result).toEqual(0);
    });
  });
});
