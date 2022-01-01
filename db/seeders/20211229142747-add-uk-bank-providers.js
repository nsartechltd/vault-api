const country = 'uk';
const created_at = new Date();
const updated_at = new Date();

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert(
        'provider',
        [
          {
            name: 'Revolut',
            provider_id: 'ob-revolut',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/revolut.svg',
            created_at,
            updated_at,
          },
          {
            name: 'Nationwide',
            provider_id: 'ob-nationwide',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/nationwide.svg',
            created_at,
            updated_at,
          },
          {
            name: 'Bank of Scotland',
            provider_id: 'ob-bos',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/bos.svg',
            created_at,
            updated_at,
          },
          {
            name: 'first direct',
            provider_id: 'ob-first-direct',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/first-direct.svg',
            created_at,
            updated_at,
          },
          {
            name: 'Starling',
            provider_id: 'oauth-starling',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/starling.svg',
            created_at,
            updated_at,
          },
          {
            name: 'Virgin Money',
            provider_id: 'ob-virgin-money',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/virgin-money.svg',
            created_at,
            updated_at,
          },
          {
            name: 'Barclays',
            provider_id: 'ob-barclays',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/barclays.svg',
            created_at,
            updated_at,
          },
          {
            name: 'Monzo',
            provider_id: 'ob-monzo',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/monzo.svg',
            created_at,
            updated_at,
          },
          {
            name: 'TSB',
            provider_id: 'ob-tsb',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/tsb.svg',
            created_at,
            updated_at,
          },
          {
            name: 'Santander',
            provider_id: 'ob-santander',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/santander.svg',
            created_at,
            updated_at,
          },
          {
            name: 'Royal Bank of Scotland',
            provider_id: 'ob-rbs',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/rbs.svg',
            created_at,
            updated_at,
          },
          {
            name: 'Lloyds',
            provider_id: 'ob-lloyds',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/lloyds.svg',
            created_at,
            updated_at,
          },
          {
            name: 'Halifax',
            provider_id: 'ob-halifax',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/halifax.svg',
            created_at,
            updated_at,
          },
          {
            name: 'Tesco Bank',
            provider_id: 'ob-tesco',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/tesco.svg',
            created_at,
            updated_at,
          },
          {
            name: 'Tide',
            provider_id: 'ob-tide',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/uk/logos/tide.svg',
            created_at,
            updated_at,
          },
          {
            name: 'HSBC',
            provider_id: 'ob-hsbc',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/hsbc.svg',
            created_at,
            updated_at,
          },
          {
            name: 'NatWest',
            provider_id: 'ob-natwest',
            country,
            logo_url:
              'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/natwest.svg',
            created_at,
            updated_at,
          },
        ],
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();

      throw err;
    }
  },
  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete('provider', {}, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();

      throw err;
    }
  },
};
