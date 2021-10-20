import fetch from 'node-fetch';
import type { APIGatewayEvent } from 'aws-lambda';
import type { Response } from 'node-fetch';

import config from '../config';

export const redirect = async (event: APIGatewayEvent) => {
  const { code } = event.queryStringParameters;

  const {
    trueLayer: { apiUrl, clientId, clientSecret, redirectUrl },
  } = config;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUrl);
  params.append('code', code);

  const response: Response = await fetch(`${apiUrl}/connect/token`, {
    method: 'POST',
    body: params,
  });
  const data = await response.json();

  console.log('DATA RETRIEVED: ', data);

  return {
    statusCode: response.status,
    body: JSON.stringify(data),
  };
};
