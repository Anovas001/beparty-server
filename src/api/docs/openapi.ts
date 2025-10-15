import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BePARTy API',
      version: '1.0.0',
      description: 'Backend API for BePARTy - Platform for nightclubs and DJs with token-based song voting',
      contact: {
        name: 'BePARTy Team',
        email: 'support@beparty.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'System health and monitoring endpoints',
      },
      {
        name: 'Authentication',
        description: 'User authentication and session management',
      },
      {
        name: 'Users',
        description: 'User profile and account management',
      },
      {
        name: 'Sessions',
        description: 'DJ sessions and music session management',
      },
      {
        name: 'Voting System',
        description: 'Token-based song voting functionality',
      },
      {
        name: 'DJ Management',
        description: 'DJ-specific session and music management (coming soon)',
      },
      {
        name: 'Development',
        description: 'Development and debugging endpoints (dev only)',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
                statusCode: {
                  type: 'number',
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique user identifier',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            display_name: {
              type: 'string',
              description: 'User display name',
            },
            role: {
              type: 'string',
              enum: ['USER', 'DJ', 'ADMIN'],
              description: 'User role in the system',
            },
            tokens_balance: {
              type: 'string',
              description: 'User token balance (BigInt as string)',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'dj@beparty.local',
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  type: 'string',
                  description: 'JWT authentication token',
                },
              },
            },
          },
        },
        Session: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique session identifier',
            },
            name: {
              type: 'string',
              description: 'Session name',
            },
            description: {
              type: 'string',
              description: 'Session description',
            },
            status: {
              type: 'string',
              enum: ['SETUP', 'LIVE', 'ENDED'],
              description: 'Current session status',
            },
            dj_id: {
              type: 'string',
              description: 'DJ user identifier',
            },
            vote_cost: {
              type: 'string',
              description: 'Cost per vote in tokens',
            },
          },
        },
        VoteRequest: {
          type: 'object',
          required: ['session_id', 'song_id', 'token_amount'],
          properties: {
            session_id: {
              type: 'integer',
              minimum: 1,
              description: 'Session ID',
              example: 1,
            },
            song_id: {
              type: 'string',
              description: 'Session Song ID (CUID format)',
              example: 'cmgsjtw75000exq087icrby56',
            },
            token_amount: {
              type: 'number',
              minimum: 1,
              maximum: 1000,
              description: 'Amount of tokens to spend on this vote',
              example: 25,
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/api/routes/*.ts', // Incluir todas las rutas
    './src/api/controllers/*.ts', // Incluir controladores si tienen documentación
  ],
};

export const openApiSpec = swaggerJSDoc(swaggerOptions);