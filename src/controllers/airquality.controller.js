const airVisualAirQualityAPIService = require('../services/airvisual.airquality.service');
const airQualityService = require('../services/airquality.service');
const logger = require('../config/logger.config');

// Main API controller 
// Expected parameters
// Lat (float value) between -90 and 90 
// Lng (float value) between -180 and 180 
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

    // Validate the range of lat value
    if (latNum < -90 || latNum > 90) {
        return res.status(400).json({ error: 'Latitude must be between -90 and 90 degrees' });
    }

    // Validate the range of the lng value 
    if (lngNum < -180 || lngNum > 180) {
        return res.status(400).json({ error: 'Longitude must be between -180 and 180 degrees' });
    }

    try {
        // call the API service and wait for the response 
        const data = await airVisualAirQualityAPIService.getAirQuality(lat, lng);

        // Parsing AirVisual API response 
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

// Get Most polluated datetime for the given city name (default Paris)
exports.getMostPollutedDatetime = async (req, res) => {
    
    // create the query obj (if city is not sent then use default city name (Paris) ) 
    const { city = 'Paris', start_date, end_date } = req.query;

    try {
        const data = await airQualityService.getMostPollutedLog({ city, start_date, end_date });

        // Check if no data returned for the given parameters (city, start_date , end_date)
        if (data.length === 0) {
            return res.status(404).json({ message: 'No data available for the given criteria' });
        }

        // Parse the retrieved response
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

// Retrieve a list of all cities that had been inserted to the DB from the cron-job
// This is a guidline for all the possible options city-names that could be used in
// the getMostPollutedDatetime API
exports.getSupportedCities = async (req, res) => {
  
    try {
        const data = await airQualityService.getSupportedCities();

        // Check if there is no cities exists in the database 
        if (data.length === 0) {
            return res.status(404).json({ message: 'No supported cities' });
        }

        res.json(data); 

    } catch (error) {
        logger.error('Error fetching supported cities: '+error.message);
        res.status(500).json({ error: 'An error occurred while fetching the supported cities' });
    }
};

