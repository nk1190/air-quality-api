const request = require('supertest');
const sinon = require('sinon');
const express = require('express');
const airQualityRouter = require('../../src/routes/airquality.route');
const airQualityController = require('../../src/controllers/airquality.controller');


// Testing air-qulaity router for each url to responed 
// with http success erorr code 200 
describe('AirQuality Router', () => {
    let app;

    before(() => {
        app = express();
        app.use('/api', airQualityRouter);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GET /api/air-quality', () => {
        it('should call getAirQuality controller method', async () => {
            const controllerStub = sinon.stub(airQualityController, 'getAirQuality').resolves();

            await request(app)
                .get('/api/air-quality')
                .query({ lat: '48.856613', lng: '2.352222' })
                .expect(200);

            expect(controllerStub.calledOnce).to.be.true;
        });
    });

    describe('GET /api/air-quality/most-polluted', () => {
        it('should call getMostPollutedDatetime controller method', async () => {
            const controllerStub = sinon.stub(airQualityController, 'getMostPollutedDatetime').resolves();

            await request(app)
                .get('/api/air-quality/most-polluted')
                .query({ city: 'Paris' })
                .expect(200);

            expect(controllerStub.calledOnce).to.be.true;
        });
    });

    describe('GET /api/air-quality/most-polluted-supported-cities', () => {
        it('should call getSupportedCities controller method', async () => {
            const controllerStub = sinon.stub(airQualityController, 'getSupportedCities').resolves();

            await request(app)
                .get('/api/air-quality/most-polluted-supported-cities')
                .expect(200);

            expect(controllerStub.calledOnce).to.be.true;
        });
    });
});
