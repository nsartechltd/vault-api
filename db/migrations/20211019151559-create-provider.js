module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('provider', {
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
    });
  },
  down: async (queryInterface) => await queryInterface.dropTable('provider'),
};
