import jwt from 'jsonwebtoken';
import type { APIGatewayEvent } from 'aws-lambda';

import base from './base';
import * as trueLayerClient from '../lib/trueLayer';
import { AuthError, NotFoundError } from '../lib/errors';

export const authenticateProvider = async (event: APIGatewayEvent) =>
  base(async (sequelize) => {
    const { code, userId } = event.queryStringParameters;

    console.log('OAuth code received from True Layer: ', code);

    const body = await trueLayerClient.getAccessToken(code);

    console.log('Data received from request: ', body);

    if (!body.access_token) {
      throw new AuthError('Unauthorised');
    }

    const { Provider, Token, User } = sequelize.models;

    const { connector_id: providerId } = jwt.decode(body.access_token);
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

    const data = {
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      expiry: body.expiry_time,
      scope: body.scope,
    };

    if (token) {
      console.log(
        'Token already found for user and provider. Replacing token.'
      );

      await token.update(data);
    } else {
      console.log('User authenticating token for the first time.');

      await Token.create({
        ...data,
        userId: user.id,
        providerId: provider.id,
      });
    }

    return {
      statusCode: 204,
    };
  });
