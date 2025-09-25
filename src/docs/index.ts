import swaggerJSDoc from 'swagger-jsdoc';
import { environment } from '../config/envVar';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Serverless Todo API',
      version: '1.0.0',
      description: 'A serverless REST API for managing todo items built with Express.js, AWS Lambda, DynamoDB, and API Gateway',
    },
    servers: [
      {
        url: environment === 'production' 
          ? 'https://your-api-gateway-url.amazonaws.com/prod/api/v1'
          : 'https://your-api-gateway-url.amazonaws.com/dev/api/v1',
        description: environment === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            verified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Todo: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            completed: { type: 'boolean' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            dueDate: { type: 'string', format: 'date-time' },
            tags: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          description: 'Check if the API is running',
          responses: {
            '200': {
              description: 'API is healthy',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ApiResponse',
                  },
                },
              },
            },
          },
        },
      },
      '/auth/register': {
        post: {
          summary: 'Register a new user',
          description: 'Create a new user account',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['firstName', 'lastName', 'email', 'password'],
                  properties: {
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              user: { $ref: '#/components/schemas/User' },
                              token: { type: 'string' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
            },
            '409': {
              description: 'User already exists',
            },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Login user',
          description: 'Authenticate user and return JWT token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              user: { $ref: '#/components/schemas/User' },
                              token: { type: 'string' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '401': {
              description: 'Invalid credentials',
            },
          },
        },
      },
      '/auth/me': {
        get: {
          summary: 'Get current user profile',
          description: 'Get the profile of the authenticated user',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'User profile retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/User' },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
            },
          },
        },
      },
      '/todos': {
        get: {
          summary: 'Get all todos',
          description: 'Get all todos for the authenticated user',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'limit',
              in: 'query',
              description: 'Number of todos to return',
              schema: { type: 'integer', default: 50 },
            },
            {
              name: 'lastKey',
              in: 'query',
              description: 'Pagination key for next page',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Todos retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              todos: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Todo' },
                              },
                              pagination: {
                                type: 'object',
                                properties: {
                                  limit: { type: 'integer' },
                                  lastEvaluatedKey: { type: 'string' },
                                  hasMore: { type: 'boolean' },
                                },
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
            },
          },
        },
        post: {
          summary: 'Create a new todo',
          description: 'Create a new todo for the authenticated user',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string', minLength: 1, maxLength: 200 },
                    description: { type: 'string', maxLength: 1000 },
                    priority: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' },
                    dueDate: { type: 'string', format: 'date-time' },
                    tags: { type: 'array', items: { type: 'string', maxLength: 50 } },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Todo created successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Todo' },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
            },
            '401': {
              description: 'Unauthorized',
            },
          },
        },
      },
      '/todos/{id}': {
        get: {
          summary: 'Get todo by ID',
          description: 'Get a specific todo by its ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Todo ID',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Todo retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Todo' },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
            },
            '403': {
              description: 'Access denied',
            },
            '404': {
              description: 'Todo not found',
            },
          },
        },
        put: {
          summary: 'Update todo',
          description: 'Update a specific todo',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Todo ID',
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', minLength: 1, maxLength: 200 },
                    description: { type: 'string', maxLength: 1000 },
                    completed: { type: 'boolean' },
                    priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                    dueDate: { type: 'string', format: 'date-time' },
                    tags: { type: 'array', items: { type: 'string', maxLength: 50 } },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Todo updated successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/ApiResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Todo' },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
            },
            '401': {
              description: 'Unauthorized',
            },
            '403': {
              description: 'Access denied',
            },
            '404': {
              description: 'Todo not found',
            },
          },
        },
        delete: {
          summary: 'Delete todo',
          description: 'Delete a specific todo',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Todo ID',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Todo deleted successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
            },
            '403': {
              description: 'Access denied',
            },
            '404': {
              description: 'Todo not found',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*/*.ts'],
};

export const specs = swaggerJSDoc(options);
