module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeConstraint('token', 'token_ibfk_2', {
        transaction,
      });

      await queryInterface.changeColumn(
        'token',
        'provider_id',
        {
          type: Sequelize.STRING,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'token',
        'logo_url',
        {
          type: Sequelize.STRING,
        },
        { transaction }
      );

      await queryInterface.dropTable('provider', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();

      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'provider',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          name: {
            type: Sequelize.STRING,
          },
          providerId: {
            type: Sequelize.STRING,
            field: 'provider_id',
          },
          country: {
            type: Sequelize.STRING,
          },
          logoUrl: {
            type: Sequelize.STRING,
            field: 'logo_url',
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

      await queryInterface.removeConstraint('token', 'token_ibfk_1', {
        transaction,
      });

      await queryInterface.removeColumn('token', 'provider_id', {
        transaction,
      });

      await queryInterface.addColumn(
        'token',
        'provider_id',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'provider',
            key: 'id',
            as: 'providerId',
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
};
