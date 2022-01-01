const created_at = new Date();
const updated_at = new Date();

const providerId = 'oauth-starling';
const email = 'test.user@email.com';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const [{ id: provider_id }] = await queryInterface.sequelize.query(
        'SELECT id FROM provider WHERE provider_id = :providerId',
        {
          replacements: {
            providerId,
          },
          type: Sequelize.QueryTypes.SELECT,
          transaction,
        }
      );

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

      await queryInterface.bulkInsert(
        'token',
        [
          {
            access_token: 'SOME-ACCESS-TOKEN',
            refresh_token: 'SOME-REFRESH-TOKEN',
            expiry: 12345,
            scope: 'scopes',
            user_id,
            provider_id,
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
      await queryInterface.bulkDelete('token', {}, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();

      throw err;
    }
  },
};
