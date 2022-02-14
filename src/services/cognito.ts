import type { APIGatewayEvent } from 'aws-lambda';

import base from './base';
// import config from '../config';

export const storeUserData = (event: APIGatewayEvent) =>
  base(async () => {
    console.log('EVENT RECEIVED', JSON.stringify(event));

    return {
      statusCode: 204,
    };
  });
