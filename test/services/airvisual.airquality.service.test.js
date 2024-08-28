const sinon = require('sinon');
const axios = require('axios');
const airVisualService = require('../../src/services/airvisual.airquality.service');
let expect ; 

before(async function () {
    this.timeout(10000); // Set timeout to 10 seconds
    ({ expect } = await import('chai'));
  });

describe('AirVisualService', () => {
  describe('getAirQuality', () => {
    it('should return air quality data for valid coordinates', async () => {
      const mockApiResponse = {
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

      sinon.stub(axios, 'get').resolves({ data: mockApiResponse });

      const result = await airVisualService.getAirQuality(48.856613, 2.352222);
      expect(result).to.be.an('object');
      expect(result.data.city).to.equal('Paris');

      axios.get.restore();
    });

    it('should throw an error if the API call fails', async () => {
      sinon.stub(axios, 'get').rejects(new Error('API call failed'));

      try {
        await airVisualService.getAirQuality(48.856613, 2.352222);
      } catch (error) {
        expect(error).to.be.an('error');
        expect(error.message).to.equal('API call failed');
      }

      axios.get.restore();
    });
  });
});
