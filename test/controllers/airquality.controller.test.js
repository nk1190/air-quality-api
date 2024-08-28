const sinon = require('sinon');
const airQualityController = require('../../src/controllers/airquality.controller');
const airVisualAirQualityAPIService = require('../../src/services/airvisual.airquality.service');
const airQualityService = require('../../src/services/airquality.service');
const logger = require('../../src/config/logger.config');
let expect ; 

before(async function () {
    this.timeout(10000); 
    ({ expect } = await import('chai'));
  });


describe('AirQualityController', () => {

    afterEach(() => {
        // Restore the original methods after each test
        sinon.restore();
    });


    // Test the Air Quality Retriever API 
    describe('getAirQuality', () => {

        // Test if one of the required parameters us missing (lng is missing)
        it('should return 400 if lat or lng is missing', async () => {
            const req = { query: { lat: '48.856613' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

            await airQualityController.getAirQuality(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ error: 'Missing required parameters, Latitude and longitude are required' })).to.be.true;
        });

        // Test if one of the parameters is invalid (sending text instead of the fload lat value)
        it('should return 400 if lat or lng are not valid numbers', async () => {
            const req = { query: { lat: 'invalid', lng: '2.352222' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

            await airQualityController.getAirQuality(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ error: 'Latitude and longitude must be valid numbers' })).to.be.true;
        });

        // Test if the sent parameters is out of range 
        // sending lat with value =100  (acceptable range between 90 and -90)
        it('should return 400 if lat is out of range', async () => {
            const req = { query: { lat: '100', lng: '2.352222' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

            await airQualityController.getAirQuality(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ error: 'Latitude must be between -90 and 90 degrees' })).to.be.true;
        });

        // Test if the sent parameters is out of range 
        // sending lng with value =-190  (acceptable range between 180 and -180)
        it('should return 400 if lng is out of range', async () => {
            const req = { query: { lat: '48.856613', lng: '-190' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

            await airQualityController.getAirQuality(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ error: 'Longitude must be between -180 and 180 degrees' })).to.be.true;
        });

        // Test the siccess scenario for retrieving the air quality data for Paris
        it('should return air quality data when valid lat and lng are provided', async () => {
            const req = { query: { lat: '48.856613', lng: '2.352222' } };
            const res = { json: sinon.spy() };
            const mockData = {
                data: {
                    city: 'Paris',
                    state: 'Ile-de-France',
                    country: 'France',
                    current: {
                        pollution: {
                            aqius: 85,
                            mainus: 'p2'
                        }
                    }
                }
            };

            sinon.stub(airVisualAirQualityAPIService, 'getAirQuality').resolves(mockData);

            await airQualityController.getAirQuality(req, res);

            expect(res.json.calledWith({
                city: mockData.data.city,
                state: mockData.data.state,
                country: mockData.data.country,
                pollution: mockData.data.current.pollution
            })).to.be.true;
        });


        // Testing the app response in case of failing to call the AIR Visual API 
        it('should handle errors from the air quality API', async () => {
            const req = { query: { lat: '48.856613', lng: '2.352222' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

            sinon.stub(airVisualAirQualityAPIService, 'getAirQuality').rejects(new Error('API call failed'));
            const loggerStub = sinon.stub(logger, 'error');

            await airQualityController.getAirQuality(req, res);

            expect(loggerStub.calledWith('Error fetching air quality data: API call failed')).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ error: 'Failed to fetch air quality data' })).to.be.true;
        });
    });

    // Testing the getMostPollutedDatetime API call 
    describe('getMostPollutedDatetime', () => {

        // Testing the normal scenario for retrieving the most polluted time for Paris 
        it('should return the most polluted datetime for the given city', async () => {
            const req = { query: { city: 'Paris' } };
            const res = { json: sinon.spy() };
            const mockData = [{ timestamp: '2024-08-27T10:00:00Z', city: 'Paris', aqi_us: 150, main_pollutant_us: 'p2' }];

            sinon.stub(airQualityService, 'getMostPollutedLog').resolves(mockData);

            await airQualityController.getMostPollutedDatetime(req, res);

            expect(res.json.calledWith({
                mostPollutedDatetime: mockData[0].timestamp,
                city: mockData[0].city,
                aqi_us: mockData[0].aqi_us,
                main_pollutant_us: mockData[0].main_pollutant_us
            })).to.be.true;
        });

        // Testing the error respomse in case there is no data found for the requested 
        // Criteria (in this case sending a fake city name )
        it('should return 404 if no data is found for the given city', async () => {
            const req = { query: { city: 'Parissss' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

            sinon.stub(airQualityService, 'getMostPollutedLog').resolves([]);

            await airQualityController.getMostPollutedDatetime(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: 'No data available for the given criteria' })).to.be.true;
        });

        // Handle error in case of database error 
        it('should handle errors when fetching the most polluted datetime', async () => {
            const req = { query: { city: 'Paris' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

            sinon.stub(airQualityService, 'getMostPollutedLog').rejects(new Error('Database error'));
            const loggerStub = sinon.stub(logger, 'error');

            await airQualityController.getMostPollutedDatetime(req, res);

            expect(loggerStub.calledWith('Error fetching the most polluted datetime: Database error')).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ error: 'An error occurred while fetching the most polluted datetime' })).to.be.true;
        });
    });


    // Testing getSupportedCities API call 
    describe('getSupportedCities', () => {

        // Testing normal scenrio of retrieveing two supported cities 
        it('should return a list of supported cities', async () => {
            const req = {};
            const res = { json: sinon.spy() };
            const mockData = [{ city: 'Paris' }, { city: 'London' }];

            sinon.stub(airQualityService, 'getSupportedCities').resolves(mockData);

            await airQualityController.getSupportedCities(req, res);

            expect(res.json.calledWith(mockData)).to.be.true;
        });

        // Test in case there is no cities found 
        it('should return 404 if no supported cities are found', async () => {
            const req = {};
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

            sinon.stub(airQualityService, 'getSupportedCities').resolves([]);

            await airQualityController.getSupportedCities(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: 'No supported cities' })).to.be.true;
        });


        // Test in case there is DB error 
        it('should handle errors when fetching supported cities', async () => {
            const req = {};
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

            sinon.stub(airQualityService, 'getSupportedCities').rejects(new Error('Database error'));
            const loggerStub = sinon.stub(logger, 'error');

            await airQualityController.getSupportedCities(req, res);

            expect(loggerStub.calledWith('Error fetching supported cities: Database error')).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ error: 'An error occurred while fetching the supported cities' })).to.be.true;
        });
    });
});
