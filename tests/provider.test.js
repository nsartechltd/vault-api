const request = require('supertest');

const server = request('http://localhost:3001/dev/api');

describe('GET /providers', () => {
  it('should retrieve a list of providers from the true layer api', () =>
    server.get('/providers').expect(200, {
      providers: [
        {
          provider_id: 'mock',
          display_name: 'Mock',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/mock.svg',
          scopes: [
            'accounts',
            'balance',
            'cards',
            'info',
            'transactions',
            'offline_access',
          ],
        },
      ],
    }));
});

describe('GET /user/{userId}/providers', () => {
  const userId = 1;

  it('should retrieve a list of the users providers from the database', () =>
    server.get(`/user/${userId}/providers`).expect(200, {
      providers: [
        {
          id: 1,
          Provider: {
            id: 5,
            name: 'Starling',
            providerId: 'oauth-starling',
            country: 'uk',
            logoUrl:
              'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/starling.svg',
          },
        },
      ],
    }));
});
