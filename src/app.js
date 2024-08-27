const express = require('express');
const app = express();
const dbConnection = require('./config/db.config');
const logger = require('./config/logger.config');
const swaggerSetup = require('./config/swagger.config');

const airQualityRoutes = require('./routes/airquality.route');

// Import the CRON job
require('./cron-jobs/parisairquality.cron'); 


swaggerSetup(app);

// Middleware
app.use(express.json());


logger.info('Server is starting...');

// Use the air quality routes
app.use('/', airQualityRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info('Server is running on port '+PORT) ; 
});


// Close the connection when the process ends
process.on('SIGINT', () => {
    dbConnection.end(err => {
        if (err) {
            logger.error('Error closing MySQL connection:'+ err);
        } else {
            logger.warn('MySQL connection closed');
        }
        process.exit();
    });
});

