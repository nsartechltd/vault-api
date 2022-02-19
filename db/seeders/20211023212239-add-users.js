module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert(
        'user',
        [
          {
            name: 'Nour',
            email: 'n6rayan@gmail.com',
            cognito_id: 'f7c4fd2d-b5e3-44e1-9963-432fd54675dd',
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
