module.exports = {
  up: async (queryInterface, Sequelize) =>
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
      trueLayerId: {
        type: Sequelize.STRING,
        field: 'true_layer_id',
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
  down: async (queryInterface) => await queryInterface.dropTable('provider'),
};
