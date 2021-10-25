module.exports = {
  up: async (queryInterface) =>
    await queryInterface.bulkInsert('provider', [
      {
        name: 'Starling',
        true_layer_id: 'uk-oauth-starling',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]),
  down: async (queryInterface) => await queryInterface.bulkDelete('provider'),
};
