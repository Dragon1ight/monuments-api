const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swggerJSDOC = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Monumento API',
            version: '1.0.0',
            description: 'API pour gérer les monuments historiques',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Serveur de développement'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            },
            schemas: {
                LoginRequest: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: { type: 'string', example: 'admin' },
                        password: { type: 'string', example: 'admin' }
                    }
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                            userId: { type: 'integer', example: 1 },
                            token: { type: 'string', example: '<jwt>' }
                            }
                        }
                    },
                },
                ApiError: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Description de l\'erreur' },
                        data: { type: 'null', example: null }
                    }
                },
            },
            responses: {    
                UnauthorizedError: {
                    description: "Accès non autorisé",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ApiError"
                            }
                        }
                    }
                },
                ValidationError: {
                    description: 'Erreur de validation',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } }
                },
            }
        },
        
    },
    apis: [path.join(__dirname, '../routes/*.route.js')],
};

const swaggerSpec = swggerJSDOC(options);

module.exports = (app) => {
    console.log('[swagger] chemin detecté: ', Object.keys(swaggerSpec.paths || {}));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
}
