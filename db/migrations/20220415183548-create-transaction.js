module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'transaction',
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
          transactionId: {
            type: Sequelize.STRING,
            field: 'transaction_id',
          },
          normalisedProviderTransactionId: {
            type: Sequelize.STRING,
            field: 'normalised_provider_transaction_id',
          },
          providerTransactionId: {
            type: Sequelize.STRING,
            field: 'provider_transaction_id',
          },
          timestamp: {
            type: Sequelize.DATE,
          },
          description: {
            type: Sequelize.STRING,
          },
          amount: {
            type: Sequelize.INTEGER,
          },
          currency: {
            type: Sequelize.STRING,
          },
          type: {
            type: Sequelize.STRING,
          },
          category: {
            type: Sequelize.STRING,
          },
          classification: {
            type: Sequelize.STRING,
          },
          merchant: {
            type: Sequelize.STRING,
          },
          balanceAmount: {
            type: Sequelize.INTEGER,
            field: 'balance_amount',
          },
          balanceCurrency: {
            type: Sequelize.STRING,
            field: 'balance_currency',
          },
          meta: {
            type: Sequelize.JSON,
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
      await queryInterface.dropTable('transaction', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();

      throw err;
    }
  },
};
