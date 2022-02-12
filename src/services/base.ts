import db from '../../db/models';

const { sequelize } = db;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json',
};

export default async (fn) => {
  console.log('[Base] Executing...');

  try {
    await sequelize.authenticate();

    const { statusCode = 200, body = null } = await fn(sequelize);
    console.log('[Base] Function executed!');

    console.log({ statusCode }, JSON.stringify(body));

    return {
      statusCode,
      headers,
      body: JSON.stringify(body),
    };
  } catch (err) {
    console.error('[Base] Error in process: ', err);

    const statusCode = err.status || err.statusCode || 500;

    return {
      statusCode,
      headers,
      body: JSON.stringify({
        message: err.message,
      }),
    };
  }
};
