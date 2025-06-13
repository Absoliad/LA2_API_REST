// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LA2_APIREST_MONEY',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], // Tous les fichiers avec des routes/commentaires Swagger
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
