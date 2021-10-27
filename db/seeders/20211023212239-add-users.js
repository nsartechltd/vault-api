module.exports = {
  up: async (queryInterface) =>
    await queryInterface.bulkInsert('user', [
      {
        name: 'Nour Rayan',
        email: 'n6rayan@gmail.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]),
  down: async (queryInterface) => await queryInterface.bulkDelete('user', {}),
};
