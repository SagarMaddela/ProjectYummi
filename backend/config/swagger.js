const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Yummi API Documentation',
      version: '1.0.0',
      description: 'API documentation for Yummi - a food ordering application',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local Development Server',
      },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT", // Indicating it's a JWT token
            },
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
  },
  apis: ['./routes/*.js'], // Points to the route files
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger Docs available at http://localhost:5000/api-docs');
};

module.exports = swaggerDocs;
