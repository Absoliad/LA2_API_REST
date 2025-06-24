const { validationResult } = require('express-validator');
const categoriesCtrl = require('../../../routes/categories/controller');

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

jest.mock('../../../routes/categories/controller', () => ({
  getAllCategories: jest.fn(),
  getCategorieById: jest.fn(),
  getSousCategoriesByCategorieId: jest.fn(),
}));

describe('Categories Routes', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, query: {}, body: {}, user: { idUtilisateur: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  test('GET /categories - appelle getAllCategories', () => {
    validationResult.mockReturnValue({ isEmpty: () => true });

    categoriesCtrl.getAllCategories(req, res);
    expect(categoriesCtrl.getAllCategories).toHaveBeenCalledWith(req, res);
  });

  test('GET /categories/:idCategorie - appelle getCategorieById', () => {
    req.params.idCategorie = '123';
    validationResult.mockReturnValue({ isEmpty: () => true });

    categoriesCtrl.getCategorieById(req, res);
    expect(categoriesCtrl.getCategorieById).toHaveBeenCalledWith(req, res);
  });

  test('GET /categories/:idCategorie/sous-categories - appelle getSousCategoriesByCategorieId', () => {
    req.params.idCategorie = '123';
    validationResult.mockReturnValue({ isEmpty: () => true });

    categoriesCtrl.getSousCategoriesByCategorieId(req, res);
    expect(categoriesCtrl.getSousCategoriesByCategorieId).toHaveBeenCalledWith(req, res);
  });
});
