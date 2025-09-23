export const openApiSpec = {
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
      description: 'Health check endpoints',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health check endpoint',
        description: 'Returns the current health status of the API',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok',
                    },
                    uptime: {
                      type: 'number',
                      example: 3600,
                    },
                    version: {
                      type: 'string',
                      example: '1.0.0',
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                      example: '2023-09-23T10:30:00.000Z',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {},
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};