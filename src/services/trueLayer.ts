import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
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

    if (!data.access_token) {
      return {
        statusCode: 401,
      };
    }

    const { Token, Provider } = sequelize.models;

    const { connector_id: providerId } = jwt.decode(data.access_token);
    const provider = await Provider.findOne({ where: { providerId } });

    const token = Token.build({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiry: data.expiry_time,
      scope: data.scope,
    });

    await token.save();
    await token.setProvider(provider.id);
    await token.setUser(1);
    await token.save();

    return {
      statusCode: response.status,
    };
  });
