const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Air Quality API',
      version: '1.0.0',
      description: 'API for retrieving and logging air quality data',
      contact: {
        name: 'N Khalil',
        email: 'naderm.khalil@gmail.com'
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ]
    }
  },
  apis: ['./src/routes/*.js', './src/models/*.js'] // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
