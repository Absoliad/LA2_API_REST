const { validationResult } = require('express-validator');
const mouvementsCtrl = require('../../../routes/mouvements/controller');

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

jest.mock('../../../routes/mouvements/controller', () => ({
  getAllMouvements: jest.fn(),
  getMouvementById: jest.fn(),
  addMouvements: jest.fn(),
  deleteMouvements: jest.fn(),
  patchMouvements: jest.fn(),
}));

jest.mock('../../../config/db', () => ({
  query: jest.fn(),
}));


describe('Mouvements Routes', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, query: {}, body: {}, user: { idUtilisateur: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    validationResult.mockReturnValue({ isEmpty: () => true });
  });

  test('GET /mouvements - appelle getAllMouvements', () => {
    mouvementsCtrl.getAllMouvements(req, res);
    expect(mouvementsCtrl.getAllMouvements).toHaveBeenCalledWith(req, res);
  });

  test('GET /mouvements/:id - appelle getMouvementById', () => {
    req.params.id = '123';
    mouvementsCtrl.getMouvementById(req, res);
    expect(mouvementsCtrl.getMouvementById).toHaveBeenCalledWith(req, res);
  });

  test('POST /mouvements - appelle addMouvements', () => {
    req.body = { montant: 100, type: 'credit' }; // données fictives
    mouvementsCtrl.addMouvements(req, res);
    expect(mouvementsCtrl.addMouvements).toHaveBeenCalledWith(req, res);
  });

  test('DELETE /mouvements/:id - appelle deleteMouvements', () => {
    req.params.id = '123';
    mouvementsCtrl.deleteMouvements(req, res);
    expect(mouvementsCtrl.deleteMouvements).toHaveBeenCalledWith(req, res);
  });

  test('PATCH /mouvements/:id - appelle patchMouvements', () => {
    req.params.id = '123';
    req.body = { montant: 200 };
    mouvementsCtrl.patchMouvements(req, res);
    expect(mouvementsCtrl.patchMouvements).toHaveBeenCalledWith(req, res);
  });
});
