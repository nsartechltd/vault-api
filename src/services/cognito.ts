import database from '../../db/models';

export const storeUserData = async (event) => {
  console.log('Event received from Cognito: ', JSON.stringify(event));

  const { sub, email, name } = event.request.userAttributes;

  const { User } = database.sequelize.models;

  await User.create({
    cognitoId: sub,
    email,
    name,
  });

  return event;
};
