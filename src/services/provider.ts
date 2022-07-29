import type { APIGatewayEvent } from 'aws-lambda';

import base from './base';
import * as trueLayerClient from '../lib/trueLayer';
import { NotFoundError } from '../lib/errors';

// We only support providers that are based in the UK
const filterProviders = (provider) => provider.country === 'uk';

export const retrieveProviders = () =>
  base(async () => {
    const body = await trueLayerClient.getProviders();

    console.log('Providers retrieved from TrueLayer: ', JSON.stringify(body));

    return {
      body: {
        providers: body.filter(filterProviders),
      },
    };
  });

export const authenticateProvider = (event) =>
  base(async (sequelize) => {
    const { logoUrl, trueLayerId, userId } = JSON.parse(event.body);

    const { Token, User } = sequelize.models;

    const user = await User.findOne({
      where: {
        cognito_id: userId,
      },
    });

    await Token.create({
      logoUrl,
      providerId: trueLayerId,
      userId: user.id,
    });

    return {
      statusCode: 201,
    };
  });

export const retrieveUserProviders = (event: APIGatewayEvent) =>
  base(async (sequelize) => {
    const {
      pathParameters: { userId },
    } = event;

    const { User, Token } = sequelize.models;

    const user = await User.findOne({
      where: {
        cognito_id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError(`User with Cognito ID: '${userId}' not found.`);
    }

    const tokens = await Token.findAll({
      where: { userId: user.id },
    });

    console.log('User tokens found: ', JSON.stringify(tokens));

    return {
      body: {
        providers: tokens,
      },
    };
  });

export const retrieveUserProviderAccounts = (event: APIGatewayEvent) =>
  base(async (sequelize) => {
    const {
      pathParameters: { userId, providerId },
    } = event;

    const { Account, Asset, Token, User } = sequelize.models;

    const user = await User.findOne({
      where: {
        cognito_id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError(`User with Cognito ID: '${userId}' not found.`);
    }

    console.log('User found: ', JSON.stringify(user));

    const token = await Token.findOne({
      where: { user_id: user.id, providerId },
      attributes: ['id'],
    });

    if (!token) {
      throw new NotFoundError(
        `Token with ID: '${providerId}' and User ID: '${user.id}' not found.`
      );
    }

    console.log('User token found: ', JSON.stringify(token));

    const assets = await Asset.findAll({
      where: { token_id: token.id },
      include: Account,
    });

    if (!assets) {
      throw new NotFoundError(`Asset with token ID: ${token.id} not found.`);
    }

    console.log('Assets found: ', JSON.stringify(assets));

    return {
      body: {
        accounts: assets,
      },
    };
  });

export const retrieveUserProviderAccountBalance = (event: APIGatewayEvent) =>
  base(async (sequelize) => {
    const {
      pathParameters: { userId, providerId, accountId },
    } = event;

    const { User, Token } = sequelize.models;

    const user = await User.findOne({
      where: {
        cognito_id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError(`User with Cognito ID: '${userId}' not found.`);
    }

    console.log('User found: ', JSON.stringify(user));

    const tokens = await Token.findOne({
      where: { userId: user.id, providerId },
      attributes: ['accessToken', 'refreshToken'],
    });

    if (!tokens) {
      throw new NotFoundError(
        `Token with ID: '${providerId}' and User ID: '${user.id}' not found.`
      );
    }

    console.log('User tokens found: ', JSON.stringify(tokens));

    const body = await trueLayerClient.getAccountBalance({
      tokens,
      accountId,
      providerId,
      userId: user.id,
    });

    console.log(
      'Account balance retrieved from TrueLayer: ',
      JSON.stringify(body)
    );

    const [{ overdraft, current, available, currency }] = body.results;

    return {
      body: {
        overdraft,
        currency,
        available,
        current,
      },
    };
  });

export const retrieveUserProviderAccountTransactions = (
  event: APIGatewayEvent
) =>
  base(async (sequelize) => {
    console.log('Event received: ', event);

    const {
      pathParameters: { userId, accountId },
    } = event;

    const { Asset, Transaction, User } = sequelize.models;

    const user = await User.findOne({
      where: {
        cognito_id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError(`User with Cognito ID: '${userId}' not found.`);
    }

    console.log('User found: ', JSON.stringify(user));

    const asset = await Asset.findOne({
      where: { accountId },
      include: Transaction,
    });

    if (!asset) {
      throw new NotFoundError(
        `Asset with account ID: '${accountId}' not found.`
      );
    }

    console.log('Asset found: ', JSON.stringify(asset));

    return {
      body: {
        transactions: asset.Transactions,
      },
    };
  });
