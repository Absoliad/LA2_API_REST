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
        },
        Auth: {
          type: 'object',
          required: ['login', 'mdp'],
          properties: {
            login: { type: 'string', exemple: 'test'},
            mdp: { type: 'string', exemple: 'test'}
          }
        },
        Register: {
          type: 'object',
          required: ['nomUtilisateur', 'prenomUtilisateur', 'login', 'mdp'],
          properties: {
            nomUtilisateur: { type: 'string', example: 'Dupont' },
            prenomUtilisateur: { type: 'string', example: 'Jean' },
            login: { type: 'string', example: 'test' },
            mdp: { type: 'string', example: 'test' },
            ville: { type: 'string', example: 'Paris' },
            codePostal: { type: 'string', example: '75000' }
          },
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
