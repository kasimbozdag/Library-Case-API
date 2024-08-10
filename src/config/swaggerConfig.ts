import { SwaggerOptions } from 'swagger-ui-express';

const options: SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management API',
      version: '1.0.0',
      description: 'API documentation for the Library Management system',
    },
    servers: [
      {
        url: 'http://localhost:3000/',
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'Endpoints related to user management',
      },
      {
        name: 'Books',
        description: 'Endpoints related to book management',
      },
      {
        name: 'Borrowing',
        description: 'Endpoints related to borrowing and returning books',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Paths to files where Swagger documentation is written
};

export default options;
