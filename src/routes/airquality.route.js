const express = require('express');
const router = express.Router();
const airQualityController = require('../controllers/airquality.controller');

/**
 * @swagger
 * /api/air-quality:
 *   get:
 *     summary: Get air quality data by coordinates for the nearest city
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude of the location
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude of the location
 *     responses:
 *       200:
 *         description: A JSON object containing air quality data
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
router.get('/api/air-quality', airQualityController.getAirQuality);

/**
 * @swagger
 * /api/air-quality/most-polluted:
 *   get:
 *     summary: Get the datetime when the specified city was most polluted
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: false
 *         description: Name of the city (defaults to Paris)
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date for filtering (optional)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date for filtering (optional)
 *     responses:
 *       200:
 *         description: A JSON object containing the most polluted datetime
 *       404:
 *         description: No data found
 *       500:
 *         description: Server error
 */
router.get('/api/air-quality/most-polluted', airQualityController.getMostPollutedDatetime);


/**
 * @swagger
 * /api/air-quality/most-polluted-supported-cities:
 *   get:
 *     summary: Get a list of the supported cities in the most polluted API
 *     responses:
 *       200:
 *         description: A JSON array containing the supported  cities
 *       500:
 *         description: Server error
 */
router.get('/api/air-quality/most-polluted-supported-cities', airQualityController.getSupportedCities);

module.exports = router;
