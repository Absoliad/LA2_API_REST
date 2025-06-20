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
            login: { type: 'string', example: 'test'},
            mdp: { type: 'string', example: 'test'}
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
        Mouvement: {
          type: 'object',
          required: ['idMouvement', 'dateMouvement', 'idCompte', 'montant', 'typeMouvement'],
          properties: {
            idMouvement: { type: 'integer', example: 1 },
            dateMouvement: { type: 'string', format: 'date', example: '2024-06-13' },
            idCompte: { type: 'integer', example: 101 },
            idTiers: { type: 'integer', nullable: true, example: 5 },
            idCategorie: { type: 'integer', nullable: true, example: 2 },
            idSousCategorie: { type: 'integer', nullable: true, example: 8 },
            idVirement: { type: 'integer', nullable: true, example: 3 },
            montant: { type: 'number', format: 'decimal', example: 125.50 },
            typeMouvement: { type: 'string', enum: ['D', 'C'], example: 'D', description: 'D pour Débit, C pour Crédit' },
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
