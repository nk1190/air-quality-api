const cron = require('node-cron');
const axios = require('axios');
const airQualityLogModel = require('../models/airqualitylog.model');
const logger = require('../config/logger.config');


// air-qulaity retriever API URL
const apiUrl = 'http://localhost:3000/api/air-quality';

// CRON Job to run every minute 
cron.schedule('* * * * *', async () => {

    logger.info('Fetching air quality data for Paris...');

    try {

        // Call the API and wait for the retrieved response 
        const response = await axios.get(apiUrl, {
            params: {
                lat: 48.856613, // Paris Lat and Lng values
                lng: 2.352222
            }
        });

        const data = response.data;
        logger.info('Air quality data for Paris response: '+JSON.stringify(data));

        // Parse the retrieved air pollution data 
        const airQualityData = {
            city: data.city,
            state: data.state,
            country: data.country,
            aqi_us: data.pollution.aqius,
            main_pollutant_us: data.pollution.mainus,
            aqi_cn: data.pollution.aqicn,
            main_pollutant_cn: data.pollution.maincn,
            timestamp: new Date()
        };

        // Insert the parsed data into the database 
        airQualityLogModel.insertNewLog(airQualityData, (err, data) => {
            if (err) {
                logger.error('Error saving air quality data: '+err.message);
            } else {
                logger.info('Air quality data saved: '+JSON.stringify(data));
            }
        }

        );

    } catch (error) {
        logger.error('Error fetching air quality data: '+error.message);
    }
});
