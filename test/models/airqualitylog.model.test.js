const sinon = require('sinon');
const dbConnection = require('../../src/config/db.config');
const AirQualityLog = require('../../src/models/airqualitylog.model');
let expect ; 

before(async function () {
    this.timeout(10000); // Set timeout to 10 seconds
    ({ expect } = await import('chai'));
  });


describe('AirQualityLog Model', () => {

    afterEach(() => {
        // Restore the original methods after each test
        sinon.restore();
    });

    // Testing inserting new record in the logs table 
    describe('insertNewLog', () => {

        // Testing normal success scenario 
        it('should insert a new log into the database', (done) => {
            const mockData = {
                city: 'Paris',
                state: 'Ile-de-France',
                country: 'France',
                aqi_us: 85,
                main_pollutant_us: 'p2',
                aqi_cn: 70,
                main_pollutant_cn: 'p1',
                timestamp: new Date()
            };
            const mockResult = { insertId: 1 };

            sinon.stub(dbConnection, 'query').yields(null, mockResult);

            AirQualityLog.insertNewLog(mockData, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.equal(mockResult.insertId);
                expect(dbConnection.query.calledOnce).to.be.true;
                done();
            });
        });

        // Testing the database error scenario 
        it('should handle database errors when inserting a new log', (done) => {
            const mockData = {
                city: 'Paris',
                state: 'Ile-de-France',
                country: 'France',
                aqi_us: 85,
                main_pollutant_us: 'p2',
                aqi_cn: 70,
                main_pollutant_cn: 'p1',
                timestamp: new Date()
            };
            const mockError = new Error('Database error');

            sinon.stub(dbConnection, 'query').yields(mockError, null);

            AirQualityLog.insertNewLog(mockData, (err, res) => {
                expect(err).to.equal(mockError);
                expect(res).to.be.null;
                expect(dbConnection.query.calledOnce).to.be.true;
                done();
            });
        });
    });

    // Testing the reterving most polluted log 
    describe('getMostPollutedLog', () => {

        // Happy Scenario  with no parameters 
        it('should retrieve the most polluted log for a city without date filters', (done) => {
            const mockData = [{ city: 'Paris', aqi_us: 150, timestamp: '2024-08-27T10:00:00Z' }];
            sinon.stub(dbConnection, 'query').yields(null, mockData);

            AirQualityLog.getMostPollutedLog({ city: 'Paris' }, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(mockData);
                expect(dbConnection.query.calledOnce).to.be.true;

                // Verify that the query did not include date filters
                const queryArgs = dbConnection.query.getCall(0).args[0];
                expect(queryArgs).to.contain('WHERE city = ?');
                expect(queryArgs).to.not.contain('AND timestamp >=');
                expect(queryArgs).to.not.contain('AND timestamp <=');
                done();
            });
        });

        // Happy Scenario  with start_date parameters only
        it('should retrieve the most polluted log for a city with start_date filter', (done) => {
            const mockData = [{ city: 'Paris', aqi_us: 150, timestamp: '2024-08-27T10:00:00Z' }];
            sinon.stub(dbConnection, 'query').yields(null, mockData);

            AirQualityLog.getMostPollutedLog({ city: 'Paris', start_date: '2024-08-26' }, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(mockData);
                expect(dbConnection.query.calledOnce).to.be.true;

                // Verify that the query included the start_date filter
                const queryArgs = dbConnection.query.getCall(0).args[0];
                expect(queryArgs).to.contain('AND timestamp >=');
                expect(queryArgs).to.not.contain('AND timestamp <=');
                done();
            });
        });

        // Happy Scenario  with end_date parameters only
        it('should retrieve the most polluted log for a city with end_date filter', (done) => {
            const mockData = [{ city: 'Paris', aqi_us: 150, timestamp: '2024-08-27T10:00:00Z' }];
            sinon.stub(dbConnection, 'query').yields(null, mockData);

            AirQualityLog.getMostPollutedLog({ city: 'Paris', end_date: '2024-08-27' }, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(mockData);
                expect(dbConnection.query.calledOnce).to.be.true;

                // Verify that the query included the end_date filter
                const queryArgs = dbConnection.query.getCall(0).args[0];
                expect(queryArgs).to.contain('AND timestamp <=');
                expect(queryArgs).to.not.contain('AND timestamp >=');
                done();
            });
        });

        // Happy Scenario  with start_date and end_date parameters
        it('should retrieve the most polluted log for a city with both start_date and end_date filters', (done) => {
            const mockData = [{ city: 'Paris', aqi_us: 150, timestamp: '2024-08-27T10:00:00Z' }];
            sinon.stub(dbConnection, 'query').yields(null, mockData);

            AirQualityLog.getMostPollutedLog({ city: 'Paris', start_date: '2024-08-26', end_date: '2024-08-27' }, (err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(mockData);
                expect(dbConnection.query.calledOnce).to.be.true;

                // Verify that the query included both start_date and end_date filters
                const queryArgs = dbConnection.query.getCall(0).args[0];
                expect(queryArgs).to.contain('AND timestamp >=');
                expect(queryArgs).to.contain('AND timestamp <=');
                done();
            });
        });

        // Handle the database error 
        it('should handle database errors when retrieving the most polluted log', (done) => {
            const mockError = new Error('Database error');
            sinon.stub(dbConnection, 'query').yields(mockError, null);

            AirQualityLog.getMostPollutedLog({ city: 'Paris' }, (err, res) => {
                expect(err).to.equal(mockError);
                expect(res).to.be.null;
                expect(dbConnection.query.calledOnce).to.be.true;
                done();
            });
        });
    });

    // Test the get-supportted cities queries 
    describe('getSupportedCities', () => {

        // happy scenario 
        it('should retrieve a list of supported cities', (done) => {
            const mockData = [{ city: 'Paris' }, { city: 'London' }];
            sinon.stub(dbConnection, 'query').yields(null, mockData);

            AirQualityLog.getSupportedCities((err, res) => {
                expect(err).to.be.null;
                expect(res).to.deep.equal(mockData);
                expect(dbConnection.query.calledOnce).to.be.true;
                done();
            });
        });

        // test the database error response 
        it('should handle database errors when retrieving supported cities', (done) => {
            const mockError = new Error('Database error');
            sinon.stub(dbConnection, 'query').yields(mockError, null);

            AirQualityLog.getSupportedCities((err, res) => {
                expect(err).to.equal(mockError);
                expect(res).to.be.null;
                expect(dbConnection.query.calledOnce).to.be.true;
                done();
            });
        });
    });
});