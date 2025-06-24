const controller = require('../../../routes/auth/controller');
const dbPersonnes = require('../../../routes/auth/db');
const ApiError = require('../../../middlewares/ApiError');
const httpStatusCodes = require('../../../middlewares/httpStatusCodes');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

jest.mock('../../../routes/auth/db');
jest.mock('argon2');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    test('devrait authentifier un utilisateur et retourner un token', async () => {
      req.body = { login: 'jdoe', mdp: 'password' };
      const mockUser = {
        idUtilisateur: 1,
        nomUtilisateur: 'Doe',
        prenomUtilisateur: 'John',
        login: 'jdoe',
        mdp: 'hashed_password',
        ville: 'Paris',
        codePostal: '75000',
      };

      dbPersonnes.getPersonneByLogin.mockResolvedValue(mockUser);
      argon2.verify.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-jwt-token');

      await controller.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.OK.code);
      expect(res.json).toHaveBeenCalledWith({
        token: 'fake-jwt-token',
        user: {
          idUtilisateur: 1,
          nomUtilisateur: 'Doe',
          prenomUtilisateur: 'John',
          login: 'jdoe',
          mdp: 'hashed_password',
          ville: 'Paris',
          codePostal: '75000',
        },
      });
    });

    test('devrait retourner 401 si login incorrect', async () => {
      req.body = { login: 'unknown', mdp: 'pass' };
      dbPersonnes.getPersonneByLogin.mockResolvedValue(null);

      await controller.login(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(httpStatusCodes.UNAUTHORIZED.code);
      expect(error.message).toBe('Email ou mot de passe incorrect');
    });

    test('devrait retourner 401 si le mot de passe est invalide', async () => {
      req.body = { login: 'jdoe', mdp: 'wrongpass' };
      dbPersonnes.getPersonneByLogin.mockResolvedValue({ mdp: 'hashed_pw' });
      argon2.verify.mockResolvedValue(false);

      await controller.login(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(httpStatusCodes.UNAUTHORIZED.code);
      expect(error.message).toBe('Email ou mot de passe incorrect');
    });

    test('devrait appeler next en cas d\'erreur', async () => {
      const error = new Error('Unexpected');
      dbPersonnes.getPersonneByLogin.mockRejectedValue(error);

      await controller.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('register', () => {
    test('devrait enregistrer un nouvel utilisateur', async () => {
      req.body = {
        nomUtilisateur: 'Doe',
        prenomUtilisateur: 'John',
        login: 'jdoe',
        mdp: 'password'
      };

      dbPersonnes.getPersonneByLogin.mockResolvedValue(null);
      argon2.hash.mockResolvedValue('hashed_pw');
      dbPersonnes.createPersonne.mockResolvedValue({
        idUtilisateur: 42,
        nom: 'Doe',
        prenom: 'John',
        email: 'jdoe',
      });

      await controller.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(httpStatusCodes.CREATED.code);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Utilisateur créé avec succès',
        user: {
          idUtilisateur: 42,
          nom: 'Doe',
          prenom: 'John',
          email: 'jdoe',
        },
      });
    });

    test('devrait retourner 400 si l\'utilisateur existe déjà', async () => {
      req.body = { login: 'jdoe' };
      dbPersonnes.getPersonneByLogin.mockResolvedValue({ login: 'jdoe' });

      await controller.register(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(httpStatusCodes.BAD_REQUEST.code);
      expect(error.message).toBe('Utilisateur déjà existant');
    });

    test('devrait appeler next en cas d\'erreur', async () => {
      const error = new Error('Erreur inconnue');
      dbPersonnes.getPersonneByLogin.mockRejectedValue(error);

      await controller.register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
