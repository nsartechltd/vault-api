import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import type { Response } from 'node-fetch';
import type { APIGatewayEvent } from 'aws-lambda';

import base from './base';
import config from '../config';
import { AuthError, NotFoundError } from '../lib/errors';

export const authenticateProvider = async (event: APIGatewayEvent) =>
  base(async (sequelize) => {
    const { code, userId } = event.queryStringParameters;

    console.log('OAuth code received from True Layer: ', code);

    const {
      trueLayer: { authUrl, clientId, clientSecret, redirectUrl },
    } = config;

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('redirect_uri', redirectUrl);
    params.append('code', code);

    console.log('URL encoded params for TrueLayer: ', params);

    const response: Response = await fetch(`${authUrl}/connect/token`, {
      method: 'POST',
      body: params,
    });
    const data = await response.json();

    console.log('Data received from request: ', data);

    if (!data.access_token) {
      throw new AuthError('Unauthorised');
    }

    const { Provider, Token, User } = sequelize.models;

    const { connector_id: providerId } = jwt.decode(data.access_token);
    const provider = await Provider.findOne({
      where: { providerId },
    });

    if (!provider) {
      throw new NotFoundError(`Provider with ID: '${providerId}' not found.`);
    }

    console.log('Provider found:', JSON.stringify(provider));

    const user = await User.findOne({
      where: {
        cognitoId: userId,
      },
    });

    if (!user) {
      throw new NotFoundError(`User with Cognito ID: '${userId}' not found.`);
    }

    console.log('User found: ', JSON.stringify(user));

    const token = await Token.findOne({
      where: {
        userId: user.id,
        providerId: provider.id,
      },
    });

    if (token) {
      console.log(
        'Token already found for user and provider. Replacing token.'
      );

      await token.update({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiry: data.expiry_time,
        scope: data.scope,
      });
    } else {
      console.log('User authenticating token for the first time.');

      await Token.create({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiry: data.expiry_time,
        scope: data.scope,
        userId: user.id,
        providerId: provider.id,
      });
    }

    return {
      statusCode: 204,
    };
  });
