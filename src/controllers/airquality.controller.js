const airVisualAirQualityAPIService = require('../services/airvisual.airquality.service');
const airQualityService = require('../services/airquality.service');
const logger = require('../config/logger.config');


exports.getAirQuality = async (req, res) => {

    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Missing required parameters, Latitude and longitude are required' });
    }

    // Validate if lat and lng are numbers
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
        return res.status(400).json({ error: 'Latitude and longitude must be valid numbers' });
    }

    // Validate the range of lat and lng
    if (latNum < -90 || latNum > 90) {
        return res.status(400).json({ error: 'Latitude must be between -90 and 90 degrees' });
    }

    if (lngNum < -180 || lngNum > 180) {
        return res.status(400).json({ error: 'Longitude must be between -180 and 180 degrees' });
    }

    try {
        
        const data = await airVisualAirQualityAPIService.getAirQuality(lat, lng);
        res.json({
            city: data.data.city,
            state: data.data.state,
            country: data.data.country,
            pollution: data.data.current.pollution
        });
    } catch (error) {
        logger.error('Error fetching air quality data: '+error.message);
        res.status(500).json({ error: 'Failed to fetch air quality data' });
    }
};


exports.getMostPollutedDatetime = async (req, res) => {
    const { city = 'Paris', start_date, end_date } = req.query;

    try {
        const data = await airQualityService.getMostPollutedLog({ city, start_date, end_date });

        if (data.length === 0) {
            return res.status(404).json({ message: 'No data available for the given criteria' });
        }

        res.json({
            mostPollutedDatetime: data[0].timestamp,
            city: data[0].city,
            aqi_us: data[0].aqi_us,
            main_pollutant_us: data[0].main_pollutant_us
        });
    } catch (error) {
        logger.error('Error fetching the most polluted datetime: '+error.message);
        res.status(500).json({ error: 'An error occurred while fetching the most polluted datetime' });
    }
};

exports.getSupportedCities = async (req, res) => {
  
    try {
        const data = await airQualityService.getSupportedCities();

        if (data.length === 0) {
            return res.status(404).json({ message: 'No supported cities' });
        }

        res.json(data); 

    } catch (error) {
        logger.error('Error fetching supported cities: '+error.message);
        res.status(500).json({ error: 'An error occurred while fetching the supported cities' });
    }
};

