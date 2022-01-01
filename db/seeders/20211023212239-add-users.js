module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert(
        'user',
        [
          {
            name: 'Test User',
            email: 'test.user@email.com',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {
          transaction,
        }
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
      await queryInterface.bulkDelete('user', {}, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();

      throw err;
    }
  },
};
