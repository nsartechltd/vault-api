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
  const userId = 'f7c4fd2d-b5e3-44e1-9963-432fd54675dd';

  it('should throw a 404 if user is not found in DB', () =>
    server.get(`/user/unknown-user/providers`).expect(404, {
      message: `User with Cognito ID: 'unknown-user' not found.`,
    }));

  it('should retrieve a list of the users providers from the database', () =>
    server.get(`/user/${userId}/providers`).expect((response) => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toMatchObject({
        providers: [
          {
            id: 1,
            createdAt: expect.stringMatching(
              /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
            ),
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
      });
    }));
});
