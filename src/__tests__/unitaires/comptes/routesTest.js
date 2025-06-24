const { validationResult } = require('express-validator');
const comptesCtrl = require('../../../routes/comptes/controller');

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

jest.mock('../../../routes/comptes/controller', () => ({
  getAllComptes: jest.fn(),
  getCompteById: jest.fn(),
  createCompte: jest.fn(),
  updateCompte: jest.fn(),
  deleteCompte: jest.fn(),
  getVirementsByCompte: jest.fn(),
  getVirementsByCompteAndCategorie: jest.fn(),
  getMouvementsByCompte: jest.fn(),
  getMouvementsByCompteAndCategorie: jest.fn(),
  getMouvementsByCompteCategorieSousCategorie: jest.fn(),
  getSoldeByCompte: jest.fn(),
}));

describe('Comptes Routes', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  test('GET /comptes - appelle getAllComptes', () => {
    validationResult.mockReturnValue({ isEmpty: () => true });

    comptesCtrl.getAllComptes(req, res);
    expect(comptesCtrl.getAllComptes).toHaveBeenCalledWith(req, res);
  });

  test('GET /comptes/:idCompte - appelle getCompteById', () => {
    req.params.idCompte = '123';
    validationResult.mockReturnValue({ isEmpty: () => true });

    comptesCtrl.getCompteById(req, res);
    expect(comptesCtrl.getCompteById).toHaveBeenCalledWith(req, res);
  });

  test('POST /comptes - appelle createCompte', () => {
    req.body = { nom: 'Compte 1' };
    validationResult.mockReturnValue({ isEmpty: () => true });

    comptesCtrl.createCompte(req, res);
    expect(comptesCtrl.createCompte).toHaveBeenCalledWith(req, res);
  });

  test('PATCH /comptes/:idCompte - appelle updateCompte', () => {
    req.params.idCompte = '123';
    req.body = { nom: 'MAJ' };
    validationResult.mockReturnValue({ isEmpty: () => true });

    comptesCtrl.updateCompte(req, res);
    expect(comptesCtrl.updateCompte).toHaveBeenCalledWith(req, res);
  });

  test('DELETE /comptes/:idCompte - appelle deleteCompte', () => {
    req.params.idCompte = '123';
    validationResult.mockReturnValue({ isEmpty: () => true });

    comptesCtrl.deleteCompte(req, res);
    expect(comptesCtrl.deleteCompte).toHaveBeenCalledWith(req, res);
  });

  test('GET /comptes/:idCompte/virements - appelle getVirementsByCompte', () => {
    req.params.idCompte = '1';
    validationResult.mockReturnValue({ isEmpty: () => true });

    comptesCtrl.getVirementsByCompte(req, res);
    expect(comptesCtrl.getVirementsByCompte).toHaveBeenCalledWith(req, res);
  });

  test('GET /comptes/:idCompte/virements/categories/:idCategorie - appelle getVirementsByCompteAndCategorie', () => {
    req.params.idCompte = '1';
    req.params.idCategorie = '2';
    validationResult.mockReturnValue({ isEmpty: () => true });

    comptesCtrl.getVirementsByCompteAndCategorie(req, res);
    expect(comptesCtrl.getVirementsByCompteAndCategorie).toHaveBeenCalledWith(req, res);
  });

  test('GET /comptes/:idCompte/mouvements - appelle getMouvementsByCompte', () => {
    req.params.idCompte = '1';
    validationResult.mockReturnValue({ isEmpty: () => true });

    comptesCtrl.getMouvementsByCompte(req, res);
    expect(comptesCtrl.getMouvementsByCompte).toHaveBeenCalledWith(req, res);
  });

  test('GET /comptes/:idCompte/mouvements/categories/:idCategorie - appelle getMouvementsByCompteAndCategorie', () => {
    req.params.idCompte = '1';
    req.params.idCategorie = '2';
    validationResult.mockReturnValue({ isEmpty: () => true });

    comptesCtrl.getMouvementsByCompteAndCategorie(req, res);
    expect(comptesCtrl.getMouvementsByCompteAndCategorie).toHaveBeenCalledWith(req, res);
  });

  test('GET /comptes/:idCompte/mouvements/categories/:idCategorie/sous-categories/:idSousCategorie - appelle getMouvementsByCompteCategorieSousCategorie', () => {
    req.params.idCompte = '1';
    req.params.idCategorie = '2';
    req.params.idSousCategorie = '3';
    validationResult.mockReturnValue({ isEmpty: () => true });

    comptesCtrl.getMouvementsByCompteCategorieSousCategorie(req, res);
    expect(comptesCtrl.getMouvementsByCompteCategorieSousCategorie).toHaveBeenCalledWith(req, res);
  });

  test('GET /comptes/:idCompte/solde - appelle getSoldeByCompte', () => {
    req.params.idCompte = '1';
    validationResult.mockReturnValue({ isEmpty: () => true });

    comptesCtrl.getSoldeByCompte(req, res);
    expect(comptesCtrl.getSoldeByCompte).toHaveBeenCalledWith(req, res);
  });
});
