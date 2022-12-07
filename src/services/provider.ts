import type { APIGatewayEvent } from 'aws-lambda';

import base from './base';
import * as trueLayerClient from '../lib/trueLayer';
import { NotFoundError } from '../lib/errors';

export const retrieveProviders = () =>
  base(async () => {
    const body = await trueLayerClient.getProviders();

    console.log('Providers retrieved from TrueLayer: ', JSON.stringify(body));

    return {
      body: {
        // We only support providers that are based in the UK
        providers: body.filter((provider) => provider.country === 'uk'),
      },
    };
  });

export const authenticateProvider = (event) =>
  base(async (sequelize) => {
    const { logoUrl, trueLayerId, userId } = JSON.parse(event.body);

    const { Provider, User } = sequelize.models;

    const user = await User.findOne({
      where: {
        cognito_id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError(`User with Cognito ID: '${userId}' not found.`);
    }

    console.log('User found: ', JSON.stringify(user));

    await Provider.create({
      logoUrl,
      trueLayerId,
      UserId: user.id,
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

    const { User, Provider } = sequelize.models;

    const user = await User.findOne({
      where: {
        cognito_id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError(`User with Cognito ID: '${userId}' not found.`);
    }

    const providers = await Provider.findAll({
      where: { user_id: user.id },
    });

    console.log('User providers found: ', JSON.stringify(providers));

    return {
      body: {
        providers: providers,
      },
    };
  });

export const retrieveUserProviderAccounts = (event: APIGatewayEvent) =>
  base(async (sequelize) => {
    const {
      pathParameters: { userId, providerId },
    } = event;

    const { Account, Asset, Provider, User } = sequelize.models;

    const user = await User.findOne({
      where: {
        cognito_id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError(`User with Cognito ID: '${userId}' not found.`);
    }

    console.log('User found: ', JSON.stringify(user));

    const provider = await Provider.findOne({
      where: { user_id: user.id, true_layer_id: providerId },
      attributes: ['id'],
    });

    if (!provider) {
      throw new NotFoundError(
        `Provider with ID: '${providerId}' and User ID: '${user.id}' not found.`
      );
    }

    console.log('User Provider found: ', JSON.stringify(provider));

    const assets = await Asset.findAll({
      where: { ProviderId: provider.id },
      include: Account,
      raw: true,
      nest: true,
    });

    if (!assets) {
      throw new NotFoundError(
        `Asset with Provider ID: ${provider.id} not found.`
      );
    }

    console.log('Assets found: ', JSON.stringify(assets));

    const something = assets.map((asset) => ({
      ...asset,
      providerId,
    }));

    console.log('SOMETHING: ', something);

    return {
      body: {
        accounts: something,
      },
    };
  });

export const retrieveUserProviderAccountBalance = (event: APIGatewayEvent) =>
  base(async (sequelize) => {
    const {
      pathParameters: { userId, providerId, accountId },
    } = event;

    const { User, Provider } = sequelize.models;

    const user = await User.findOne({
      where: {
        cognito_id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError(`User with Cognito ID: '${userId}' not found.`);
    }

    console.log('User found: ', JSON.stringify(user));

    const providers = await Provider.findOne({
      where: { user_id: user.id, true_layer_id: providerId },
      attributes: ['accessToken', 'refreshToken'],
    });

    if (!providers) {
      throw new NotFoundError(
        `Provider with ID: '${providerId}' and User ID: '${user.id}' not found.`
      );
    }

    console.log('User providers found: ', JSON.stringify(providers));

    const body = await trueLayerClient.getAccountBalance({
      tokens: providers,
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
