module.exports = {
  up: async (queryInterface, Sequelize) =>
    await queryInterface.createTable('user_provider', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        field: 'user_id',
        references: {
          model: 'User',
          key: 'id',
          as: 'userId',
        },
      },
      providerId: {
        type: Sequelize.INTEGER,
        field: 'provider_id',
        references: {
          model: 'Provider',
          key: 'id',
          as: 'providerId',
        },
      },
      tokenId: {
        type: Sequelize.INTEGER,
        field: 'token_id',
        references: {
          model: 'Token',
          key: 'id',
          as: 'tokenId',
        },
      },
      createdAt: {
        allowNull: false,
        field: 'created_at',
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        field: 'updated_at',
        type: Sequelize.DATE,
      },
    }),
  down: async (queryInterface) =>
    await queryInterface.dropTable('user_provider'),
};
