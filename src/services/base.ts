import db from '../../db/models';

const { sequelize } = db;

export default async (fn) => {
  console.log('[Base] Executing...');

  try {
    await sequelize.authenticate();

    const { statusCode = 200, body = null } = await fn(sequelize);
    console.log('[Base] Function executed!');

    return {
      statusCode,
      body: JSON.stringify(body),
    };
  } catch (err) {
    console.error('[Base] Error in process: ', err);

    const statusCode = err.status || err.statusCode || 500;

    return {
      statusCode,
      body: {
        message: err.message,
      },
    };
  }
};
