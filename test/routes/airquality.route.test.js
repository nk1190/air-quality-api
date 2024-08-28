const request = require('supertest');
const sinon = require('sinon');
const express = require('express');
const airQualityRouter = require('../../src/routes/airquality.route');
const airQualityController = require('../../src/controllers/airquality.controller');
let expect ; 
let app;

before(async function () {
    this.timeout(10000); // Set timeout to 10 seconds
    ({ expect } = await import('chai'));
  });

// Testing air-qulaity router for each url to responed 
// with http success erorr code 200 
describe('AirQuality Router', () => {
    before(() => {
        app = express();
        app.use(express.json());
        app.use('/', airQualityRouter);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GET /api/air-quality', () => {
        it('should call getAirQuality controller method', async () => {
           
            await request(app)
                .get('/api/air-quality')
                .query({ lat: '48.856613', lng: '2.352222' })
                .expect(200);

          
        });
    });

    describe('GET /api/air-quality/most-polluted', () => {
        it('should call getMostPollutedDatetime controller method', async () => {
           
            await request(app)
                .get('/api/air-quality/most-polluted')
                .query({ city: 'Paris' })
                .expect(200);

           
        });
    });

    describe('GET /api/air-quality/most-polluted-supported-cities', () => {
        it('should call getSupportedCities controller method', async () => {
      
            await request(app)
                .get('/api/air-quality/most-polluted-supported-cities')
                .expect(200);

        });
    });
});