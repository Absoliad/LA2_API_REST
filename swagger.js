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
        },
        CreateCompte: {
          type: 'object',
          required: ['descriptionCompte', 'nomBanque'],
          properties: {
            descriptionCompte: { type: 'string', example: 'Compte courant' },
            nomBanque: { type: 'string', example: 'Banque Populaire' },
            soldeInitial: { type: 'number', example: 1000.00 }
          }
        },
        Virement: {
          type: 'object',
          required: ['idCompteDebit', 'idCompteCredit', 'montant', 'dateVirement'],
          properties: {
            idCompteDebit: { type: 'integer', example: 1 },
            idCompteCredit: { type: 'integer', example: 1 },
            montant: { type: 'number', format: 'float', example: 100.50 },
            dateVirement: { type: 'string', format: 'date-time', example: '2023-10-01T12:00:00Z' },
            idVirement: { type: 'integer', example: 1 },
            idTiers: { type: 'integer', example: 1 },
            idCategorie: { type: 'integer', example: 1 },
            dateHeureCreation: { type: 'string', format: 'date-time', example: '2023-10-01T12:00:00Z' },
            dateHeureMAJ: { type: 'string', format: 'date-time', example: '2023-10-01T12:00:00Z' }
          }
        },
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
