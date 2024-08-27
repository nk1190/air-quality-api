const airQualityLogModel = require('../models/airqualitylog.model');

const AirQualityService = {};

AirQualityService.getMostPollutedLog = async ({ city, start_date, end_date }) => {
    return new Promise((resolve, reject) => {
        airQualityLogModel.getMostPollutedLog({ city, start_date, end_date }, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
};

AirQualityService.getSupportedCities = async () => {
    return new Promise((resolve, reject) => {
        airQualityLogModel.getSupportedCities((err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
};


module.exports = AirQualityService;