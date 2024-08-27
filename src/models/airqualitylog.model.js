const dbConnection = require('../config/db.config');

const AirQualityLog = {};

AirQualityLog.insertNewLog = (airQualityData, result) => {
    const query = `
    INSERT INTO air_quality_logs 
    (city, state, country, aqi_us, main_pollutant_us, aqi_china, main_pollutant_china, timestamp) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;
    const values = [
        airQualityData.city,
        airQualityData.state,
        airQualityData.country,
        airQualityData.aqi_us,
        airQualityData.main_pollutant_us,
        airQualityData.aqi_cn,
        airQualityData.main_pollutant_cn,
        airQualityData.timestamp
    ];

    dbConnection.query(query, values, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res.insertId);

    });
};


AirQualityLog.getMostPollutedLog = ({ city, start_date, end_date }, result) => {
    let query = `
        SELECT * 
        FROM air_quality_logs 
        WHERE city = ?
    `;
    const queryParams = [city];

    if (start_date) {
        query += ' AND timestamp >= ?';
        queryParams.push(start_date);
    }

    if (end_date) {
        query += ' AND timestamp <= ?';
        queryParams.push(end_date);
    }

    query += ' ORDER BY aqi_us DESC LIMIT 1';

    dbConnection.query(query, queryParams, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};



AirQualityLog.getSupportedCities = (result) => {
    let query = ' SELECT distinct city FROM air_quality_logs ' ;
    
    dbConnection.query(query, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};

module.exports = AirQualityLog;