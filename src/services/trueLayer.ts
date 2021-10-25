import fetch from 'node-fetch';
import type { Response } from 'node-fetch';
import type { APIGatewayEvent } from 'aws-lambda';

import config from '../config';
import base from './base';

export const authenticateProvider = async (event: APIGatewayEvent) =>
  base(async (sequelize) => {
    const { code } = event.queryStringParameters;

    console.log('OAuth code received from UI: ', code);

    const {
      trueLayer: { apiUrl, clientId, clientSecret, redirectUrl },
    } = config;

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('redirect_uri', redirectUrl);
    params.append('code', code);

    console.log('URL encoded params for TrueLayer: ', params);

    const response: Response = await fetch(`${apiUrl}/connect/token`, {
      method: 'POST',
      body: params,
    });
    const data = await response.json();

    console.log('Data received from request: ', data);

    const { Token, UserProvider } = sequelize.models;

    const token = await Token.create({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiry: data.expiry_time,
      scope: data.scope,
    });

    await UserProvider.create({
      userId: 1,
      providerId: 1,
      tokenId: token.id,
    });

    return {
      statusCode: response.status,
    };
  });
