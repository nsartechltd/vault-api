import db from '../../db/models';

export const updateUserToken = async (userId, providerId, data) => {
  const { Token } = db.sequelize.models;

  const token = await Token.findOne({
    where: {
      userId,
      providerId,
    },
  });

  await token.update({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    scope: data.scope,
    expiry: data.expiry_time,
  });
};
