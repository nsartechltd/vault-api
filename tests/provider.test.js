const request = require('supertest');

const server = request('http://localhost:3001/dev/api');

describe('GET /providers', () => {
  it('should retrieve a list of providers from the true layer api', () =>
    server.get('/providers').expect(200, {
      providers: [
        {
          provider_id: 'ob-revolut',
          display_name: 'Revolut',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/revolut.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'direct_debits',
            'standing_orders',
            'offline_access',
          ],
        },
        {
          provider_id: 'ob-nationwide',
          display_name: 'Nationwide',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/nationwide.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'cards',
            'direct_debits',
            'standing_orders',
            'offline_access',
          ],
        },
        {
          provider_id: 'ob-bos',
          display_name: 'Bank of Scotland',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/bos.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'cards',
            'direct_debits',
            'standing_orders',
            'offline_access',
          ],
        },
        {
          provider_id: 'ob-first-direct',
          display_name: 'first direct',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/first-direct.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'cards',
            'offline_access',
          ],
        },
        {
          provider_id: 'oauth-starling',
          display_name: 'Starling',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/starling.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'offline_access',
          ],
        },
        {
          provider_id: 'ob-virgin-money',
          display_name: 'Virgin Money',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/virgin-money.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'cards',
            'direct_debits',
            'standing_orders',
            'offline_access',
          ],
        },
        {
          provider_id: 'ob-barclays',
          display_name: 'Barclays',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/barclays.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'cards',
            'direct_debits',
            'standing_orders',
            'offline_access',
          ],
        },
        {
          provider_id: 'ob-monzo',
          display_name: 'Monzo',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/monzo.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'direct_debits',
            'standing_orders',
            'offline_access',
          ],
        },
        {
          provider_id: 'ob-tsb',
          display_name: 'TSB',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/tsb.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'cards',
            'direct_debits',
            'standing_orders',
            'offline_access',
          ],
        },
        {
          provider_id: 'ob-santander',
          display_name: 'Santander',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/santander.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'cards',
            'direct_debits',
            'standing_orders',
            'offline_access',
          ],
        },
        {
          provider_id: 'ob-rbs',
          display_name: 'Royal Bank of Scotland',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/rbs.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'cards',
            'direct_debits',
            'standing_orders',
            'offline_access',
          ],
        },
        {
          provider_id: 'ob-lloyds',
          display_name: 'Lloyds',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/lloyds.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'cards',
            'direct_debits',
            'standing_orders',
            'offline_access',
          ],
        },
        {
          provider_id: 'ob-halifax',
          display_name: 'Halifax',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/halifax.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'cards',
            'direct_debits',
            'standing_orders',
            'offline_access',
          ],
        },
        {
          provider_id: 'ob-tesco',
          display_name: 'Tesco Bank',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/tesco.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'cards',
            'direct_debits',
            'standing_orders',
            'offline_access',
          ],
        },
        {
          provider_id: 'ob-tide',
          display_name: 'Tide',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/tide.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'direct_debits',
            'standing_orders',
            'offline_access',
          ],
        },
        {
          provider_id: 'ob-hsbc',
          display_name: 'HSBC',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/hsbc.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'cards',
            'direct_debits',
            'standing_orders',
            'offline_access',
          ],
        },
        {
          provider_id: 'ob-natwest',
          display_name: 'NatWest',
          country: 'uk',
          logo_url:
            'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/natwest.svg',
          scopes: [
            'info',
            'accounts',
            'balance',
            'transactions',
            'cards',
            'direct_debits',
            'standing_orders',
            'offline_access',
          ],
        },
      ],
    }));
});
