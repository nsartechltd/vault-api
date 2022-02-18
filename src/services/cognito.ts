import base from './base';

export const storeUserData = (event) =>
  base(async (sequelize) => {
    const { sub, email, name } = event.request.userAttributes;

    const { User } = sequelize.models;

    await User.create({
      cognitoId: sub,
      email,
      name,
    });

    return event;
  });
