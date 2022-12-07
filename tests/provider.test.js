const request = require('supertest');

const server = request('http://localhost:3001/dev/api');

const userId = 'f7c4fd2d-b5e3-44e1-9963-432fd54675dd';
const providerId = 'oauth-starling';
const accountId = '50m3-uu1d-1-m4d3';

describe('POST /provider/authenticate', () => {
  it('should throw an error if user is not found', () =>
    server
      .post('/provider/authenticate')
      .send({
        logoUrl: 'https://some-logo.url',
        trueLayerId: 'some-tl-id',
        userId: 'some-unknown-user',
      })
      .expect(404));

  it('should store some provider details into database', () =>
    server
      .post('/provider/authenticate')
      .send({
        logoUrl: 'https://some-logo.url',
        trueLayerId: 'some-tl-id',
        userId,
      })
      .expect(201));
});

describe('GET /providers', () => {
  it('should retrieve a list of providers from the true layer api', async () => {
    const response = await server.get('/providers');

    expect(response.statusCode).toEqual(200);
    expect(response.body.providers).toEqual(
      expect.arrayContaining([
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
      ])
    );
  });
});

describe('GET /user/{userId}/providers', () => {
  it('should throw a 404 if user is not found in DB', () =>
    server.get(`/user/unknown-user/providers`).expect(404, {
      message: `User with Cognito ID: 'unknown-user' not found.`,
    }));

  it('should retrieve a list of the users providers from the database', () =>
    server.get(`/user/${userId}/providers`).expect((response) => {
      expect(response.statusCode).toEqual(200);
      expect(response.body.providers).toEqual(
        expect.arrayContaining([
          {
            UserId: 1,
            accessToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            createdAt: expect.stringMatching(
              /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
            ),
            expiry: 12345,
            id: 1,
            logoUrl:
              'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/starling.svg',
            trueLayerId: 'oauth-starling',
            refreshToken: 'SOME-REFRESH-TOKEN',
            scope: 'scopes',
            updatedAt: expect.stringMatching(
              /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
            ),
          },
        ])
      );
    }));
});

describe('GET /user/{userId}/provider/{providerId}/accounts', () => {
  it('should throw a 404 if user is not found in DB', () =>
    server
      .get(`/user/unknown-user/provider/${providerId}/accounts`)
      .expect(404, {
        message: `User with Cognito ID: 'unknown-user' not found.`,
      }));

  it('should throw a 404 if provider is not found in DB', () =>
    server
      .get(`/user/${userId}/provider/unknown-provider/accounts`)
      .expect(404, {
        message: `Provider with ID: 'unknown-provider' and User ID: '1' not found.`,
      }));

  it('should retrieve a list of the users providers accounts from the database', () =>
    server
      .get(`/user/${userId}/provider/${providerId}/accounts`)
      .expect((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchObject({
          accounts: [
            {
              id: 1,
              type: 'account',
              accountId,
              createdAt: expect.stringMatching(
                /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
              ),
              updatedAt: expect.stringMatching(
                /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
              ),
              ProviderId: 1,
              Account: {
                id: 1,
                type: 'TRANSACTION',
                name: 'Personal Account',
                currency: 'GBP',
                accountNumber: '12345678',
                sortCode: '12-34-56',
                iban: 'some-ibam',
                bic: 'some-bic',
                createdAt: expect.stringMatching(
                  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
                ),
                updatedAt: expect.stringMatching(
                  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
                ),
                AssetId: 1,
              },
              providerId: 'oauth-starling',
            },
          ],
        });
      }));
});

describe('GET /user/{userId}/provider/{providerId}/account/{accountId}/transactions', () => {
  it('should throw a 404 if user is not found in DB', () =>
    server
      .get(
        `/user/unknown-user/provider/${providerId}/account/${accountId}/transactions`
      )
      .expect(404, {
        message: `User with Cognito ID: 'unknown-user' not found.`,
      }));

  it('should throw a 404 if account is not found in DB', () =>
    server
      .get(
        `/user/${userId}/provider/${providerId}/account/unknown-account/transactions`
      )
      .expect(404, {
        message: `Asset with account ID: 'unknown-account' not found.`,
      }));

  it('should retrieve a list of the users accounts from the database', () =>
    server
      .get(
        `/user/${userId}/provider/${providerId}/account/${accountId}/transactions`
      )
      .expect((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body.transactions).toEqual(
          expect.arrayContaining([
            {
              id: 1,
              transactionId: 'some-t-id',
              normalisedProviderTransactionId: 'some-npt-id',
              providerTransactionId: 'some-pt-id',
              timestamp: expect.stringMatching(
                /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
              ),
              description: 'Gym Membership',
              amount: -21,
              currency: 'GBP',
              type: 'DEBIT',
              category: 'PURCHASE',
              classification: 'Fitness, Sport',
              merchant: 'Gym',
              balanceAmount: 1235,
              balanceCurrency: 'GBP',
              meta: {
                bank_transaction_id: '9882ks-00js',
                provider_transaction_category: 'DEB',
              },
              createdAt: expect.stringMatching(
                /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
              ),
              updatedAt: expect.stringMatching(
                /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
              ),
              AssetId: 1,
            },
          ])
        );
      }));
});
