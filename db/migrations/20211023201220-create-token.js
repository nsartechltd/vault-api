module.exports = {
  up: async (queryInterface, Sequelize) =>
    await queryInterface.createTable('token', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      accessToken: {
        type: Sequelize.STRING(2000),
        field: 'access_token',
      },
      refreshToken: {
        type: Sequelize.STRING,
        field: 'refresh_token',
      },
      expiry: {
        type: Sequelize.INTEGER,
      },
      scope: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
        field: 'user_id',
        references: {
          model: 'user',
          key: 'id',
          as: 'userId',
        },
      },
      providerId: {
        type: Sequelize.INTEGER,
        field: 'provider_id',
        references: {
          model: 'provider',
          key: 'id',
          as: 'providerId',
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
  down: async (queryInterface) => await queryInterface.dropTable('token'),
};
