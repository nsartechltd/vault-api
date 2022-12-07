module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'account',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          assetId: {
            type: Sequelize.INTEGER,
            field: 'asset_id',
            allowNull: false,
            references: {
              model: 'asset',
              key: 'id',
              as: 'assetId',
            },
          },
          accountId: {
            type: Sequelize.STRING,
            field: 'account_id',
          },
          type: {
            type: Sequelize.STRING,
          },
          name: {
            type: Sequelize.STRING,
          },
          currency: {
            type: Sequelize.STRING,
          },
          accountNumber: {
            type: Sequelize.STRING,
            field: 'account_number',
          },
          sortCode: {
            type: Sequelize.STRING,
            field: 'sort_code',
          },
          iban: {
            type: Sequelize.STRING,
          },
          bic: {
            type: Sequelize.STRING,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            field: 'created_at',
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            field: 'updated_at',
          },
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();

      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('account', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();

      throw err;
    }
  },
};
