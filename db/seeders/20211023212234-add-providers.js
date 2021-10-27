const created_at = new Date();
const updated_at = new Date();

module.exports = {
  up: async (queryInterface) =>
    await queryInterface.bulkInsert('provider', [
      {
        name: 'Starling',
        true_layer_id: 'uk-oauth-starling',
        created_at,
        updated_at,
      },
      {
        name: 'Mock Provider',
        true_layer_id: 'uk-cs-mock',
        created_at,
        updated_at,
      },
    ]),
  down: async (queryInterface) =>
    await queryInterface.bulkDelete('provider', {}),
};
