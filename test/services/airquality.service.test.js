const sinon = require('sinon');
const airQualityLogModel = require('../../src/models/airqualitylog.model');
const AirQualityService = require('../../src/services/airquality.service');
const db = require('../../src/config/db.config');
const logger = require('../../src/config/logger.config');
let expect ; 

before(async function () {
    this.timeout(10000); // Set timeout to 10 seconds
    ({ expect } = await import('chai'));
  });

describe('AirQualityService', () => {

    afterEach(() => {
        // Restore the original methods after each test
        sinon.restore();
    });

    describe('getMostPollutedLog', () => {
        it('should resolve with data when model returns data', async () => {
            const mockData = [{ city: 'Paris', aqi: 150, timestamp: '2024-08-27T10:00:00Z' }];
            sinon.stub(airQualityLogModel, 'getMostPollutedLog').yields(null, mockData);

            const result = await AirQualityService.getMostPollutedLog({ city: 'Paris', start_date: '2024-08-26', end_date: '2024-08-27' });
            expect(result).to.deep.equal(mockData);
        });

        it('should reject with an error when model returns an error', async () => {
            const mockError = new Error('Database error');
            sinon.stub(airQualityLogModel, 'getMostPollutedLog').yields(mockError, null);

            try {
                await AirQualityService.getMostPollutedLog({ city: 'Paris', start_date: '2024-08-26', end_date: '2024-08-27' });
            } catch (error) {
                expect(error).to.equal(mockError);
            }
        });
    });

    describe('getSupportedCities', () => {
        it('should resolve with data when model returns data', async () => {
            const mockData = [{ city: 'Paris' }, { city: 'London' }];
            sinon.stub(airQualityLogModel, 'getSupportedCities').yields(null, mockData);

            const result = await AirQualityService.getSupportedCities();
            expect(result).to.deep.equal(mockData);
        });

        it('should reject with an error when model returns an error', async () => {
            const mockError = new Error('Database error');
            sinon.stub(airQualityLogModel, 'getSupportedCities').yields(mockError, null);

            try {
                await AirQualityService.getSupportedCities();
            } catch (error) {
                expect(error).to.equal(mockError);
            }
        });
    });
});


after(() => {
    db.end((err) => {
        if (err) {
            logger.error('Error closing the database connection:'+err);
        } else {
            logger.info('Database connection closed.');
        }
    });
});