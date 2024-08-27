require('dotenv').config();
const logger = require('../config/logger.config');
const axios = require('axios');

const AirVisualAirQualityAPIService = {};

AirVisualAirQualityAPIService.getAirQuality = async (lat, lng) => {
    try {
        const response = await axios.get(process.env.AIR_VISUAL_API_URL, {
            params: {
                lat: lat,
                lon: lng,
                key: process.env.AIR_VISUAL_API_KEY
            }
        });

        return response.data;
    } catch (error) {
        logger.error('Error fetching air quality data from API:' + error.message);
        throw error; // Rethrow the error so the controller can handle it
    }
};

module.exports = AirVisualAirQualityAPIService;
