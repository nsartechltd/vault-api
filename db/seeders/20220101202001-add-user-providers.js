const created_at = new Date();
const updated_at = new Date();

const email = 'n6rayan@gmail.com';
const trueLayerId = 'oauth-starling';
const accountId = '50m3-uu1d-1-m4d3';
const accountName = 'Personal Account';

const insertProvider = async (
  queryInterface,
  Sequelize,
  transaction,
  userId
) => {
  await queryInterface.bulkInsert(
    'provider',
    [
      {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        refresh_token: 'SOME-REFRESH-TOKEN',
        expiry: 12345,
        scope: 'scopes',
        user_id: userId,
        true_layer_id: 'oauth-starling',
        logo_url:
          'https://truelayer-provider-assets.s3.amazonaws.com/global/logos/starling.svg',
        created_at,
        updated_at,
      },
    ],
    { transaction }
  );

  const [{ id: provider_id }] = await queryInterface.sequelize.query(
    'SELECT id FROM provider WHERE true_layer_id = :trueLayerId',
    {
      replacements: {
        trueLayerId,
      },
      type: Sequelize.QueryTypes.SELECT,
      transaction,
    }
  );

  return provider_id;
};

const addProviderAccount = async (
  queryInterface,
  Sequelize,
  transaction,
  providerId
) => {
  await queryInterface.bulkInsert(
    'asset',
    [
      {
        type: 'account',
        account_id: accountId,
        provider_id: providerId,
        created_at,
        updated_at,
      },
    ],
    { transaction }
  );

  const [{ id: asset_id }] = await queryInterface.sequelize.query(
    'SELECT id FROM asset WHERE account_id = :accountId',
    {
      replacements: {
        accountId,
      },
      type: Sequelize.QueryTypes.SELECT,
      transaction,
    }
  );

  await queryInterface.bulkInsert(
    'account',
    [
      {
        type: 'TRANSACTION',
        name: accountName,
        currency: 'GBP',
        account_number: '12345678',
        sort_code: '12-34-56',
        iban: 'some-ibam',
        bic: 'some-bic',
        asset_id,
        created_at,
        updated_at,
      },
    ],
    { transaction }
  );

  return asset_id;
};

const addAccountTransactions = (queryInterface, transaction, asset_id) =>
  queryInterface.bulkInsert(
    'transaction',
    [
      {
        asset_id,
        transaction_id: 'some-t-id',
        normalised_provider_transaction_id: 'some-npt-id',
        provider_transaction_id: 'some-pt-id',
        timestamp: new Date(),
        description: 'Gym Membership',
        amount: -20.99,
        currency: 'GBP',
        type: 'DEBIT',
        category: 'PURCHASE',
        classification: 'Fitness, Sport',
        merchant: 'Gym',
        balance_amount: 1234.5,
        balance_currency: 'GBP',
        meta: JSON.stringify({
          bank_transaction_id: '9882ks-00js',
          provider_transaction_category: 'DEB',
        }),
        created_at,
        updated_at,
      },
    ],
    { transaction }
  );

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const [{ id: user_id }] = await queryInterface.sequelize.query(
        'SELECT * FROM user WHERE email = :email',
        {
          replacements: {
            email,
          },
          type: Sequelize.QueryTypes.SELECT,
          transaction,
        }
      );

      const provider_id = await insertProvider(
        queryInterface,
        Sequelize,
        transaction,
        user_id
      );

      const asset_id = await addProviderAccount(
        queryInterface,
        Sequelize,
        transaction,
        provider_id
      );

      await addAccountTransactions(queryInterface, transaction, asset_id);

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
