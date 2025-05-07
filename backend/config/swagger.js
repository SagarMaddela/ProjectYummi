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
        url: 'https://projectyummi-web-service.onrender.com/api',
        // url: 'http://localhost:5000/',
        description: 'Production Server',
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
// console.log(JSON.stringify(swaggerSpec, null, 2));

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger Docs available at https://projectyummi-web-service.onrender.com/api-docs');
};

module.exports = swaggerDocs;

