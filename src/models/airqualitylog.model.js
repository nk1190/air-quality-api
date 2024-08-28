const dbConnection = require('../config/db.config');

const AirQualityLog = {};


// Insert a new log for the retrieved air quality 
AirQualityLog.insertNewLog = (airQualityData, result) => {
    
    // init mysql insertion query stmt 
    const query = `
    INSERT INTO air_quality_logs 
    (city, state, country, aqi_us, main_pollutant_us, aqi_china, main_pollutant_china, timestamp) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

    // bind the query values  
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

    // execute the query stmt 
    dbConnection.query(query, values, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        // return the new generated
        result(null, res.insertId);

    });
};


// Get the most poluuted timestamp for the given city 
AirQualityLog.getMostPollutedLog = ({ city, start_date, end_date }, result) => {
   
    // init the slection query 
    let query = `
        SELECT * 
        FROM air_quality_logs 
        WHERE city = ?
    `;

    // init the query conditions part (initally with the city name)
    const queryParams = [city];

    // check if the start_date parameter is required and add the relative 
    // condition to the query
    if (start_date) {
        query += ' AND timestamp >= ?';
        queryParams.push(start_date);
    }

    // check if the end_date parameter is required and add the relative 
    // condition to the query
    if (end_date) {
        query += ' AND timestamp <= ?';
        queryParams.push(end_date);
    }

    // order by the most polluted index (us based) and limit the result with 1 
    // (retrieve the most polluted record based on the US index (aqi_us) )
    query += ' ORDER BY aqi_us DESC LIMIT 1';

    dbConnection.query(query, queryParams, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};


// Get all the inserted city names 
AirQualityLog.getSupportedCities = (result) => {

    // init the database query to retrieve distinct city value of all the inserted logs 
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