const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LA2_APIREST_MONEY',
      version: '1.0.0',
      description: 'Documentation de l’API',
    },
    servers: [
      { 
        url: 'http://localhost:3000/',
        description: `${process.env.NODE_ENV} server`
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: {token}"'
        }
      },
      schemas: {
        Token: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: [
    path.join(__dirname, 'routes/**/*.js') // Pour toutes les routes
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
