const db = require('../../../config/db');
const { getPersonneByLogin, createPersonne } = require('../../../routes/auth/db');

jest.mock('../../../config/db', () => ({
  query: jest.fn(),
}));

describe('Service auth', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPersonneByLogin', () => {
    test('devrait retourner un utilisateur si le login existe', async () => {
      const mockResults = [{ idUtilisateur: 1, login: 'jdoe' }];
      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResults);
      });

      await expect(getPersonneByLogin('jdoe')).resolves.toEqual(mockResults[0]);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT * FROM Utilisateur WHERE login = ?',
        ['jdoe'],
        expect.any(Function)
      );
    });

    test('devrait retourner null si aucun utilisateur trouvé', async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      await expect(getPersonneByLogin('inexistant')).resolves.toBeNull();
    });

    test('devrait rejeter en cas d\'erreur SQL', async () => {
      const error = new Error('Erreur de base de données');
      db.query.mockImplementation((query, params, callback) => {
        callback(error, null);
      });

      await expect(getPersonneByLogin('jdoe')).rejects.toThrow('Erreur de base de données');
    });
  });

  describe('createPersonne', () => {
    test('devrait créer un utilisateur avec succès', async () => {
      const mockResult = { insertId: 42 };
      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const personne = {
        nomUtilisateur: 'Doe',
        prenomUtilisateur: 'John',
        login: 'jdoe',
        password_hash: 'hashed_pw',
        ville: 'Paris',
        codePostal: '75000',
      };

      await expect(createPersonne(personne)).resolves.toEqual(mockResult);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO Utilisateur'),
        ['Doe', 'John', 'jdoe', 'hashed_pw', 'Paris', '75000'],
        expect.any(Function)
      );
    });

    test('devrait insérer avec ville et codePostal null si non fournis', async () => {
      const mockResult = { insertId: 43 };
      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const personne = {
        nomUtilisateur: 'Smith',
        prenomUtilisateur: 'Alice',
        login: 'asmith',
        password_hash: 'hashed_pw',
        // ville et codePostal absents
      };

      await expect(createPersonne(personne)).resolves.toEqual(mockResult);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO Utilisateur'),
        ['Smith', 'Alice', 'asmith', 'hashed_pw', null, null],
        expect.any(Function)
      );
    });

    test('devrait rejeter en cas d\'erreur lors de l\'insertion', async () => {
      const error = new Error('Erreur insertion utilisateur');
      db.query.mockImplementation((query, params, callback) => {
        callback(error, null);
      });

      const personne = {
        nomUtilisateur: 'Test',
        prenomUtilisateur: 'User',
        login: 'tuser',
        password_hash: 'hashed_pw'
      };

      await expect(createPersonne(personne)).rejects.toThrow('Erreur insertion utilisateur');
    });
  });
});
