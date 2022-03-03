import type { APIGatewayEvent } from 'aws-lambda';

import base from './base';
import * as trueLayerClient from '../lib/trueLayer';
import { NotFoundError } from '../lib/errors';

const SUPPORTED_PROVIDERS = [
  'ob-natwest',
  'ob-hsbc',
  'ob-tide',
  'ob-tesco',
  'ob-halifax',
  'ob-lloyds',
  'ob-rbs',
  'ob-santander',
  'ob-tsb',
  'ob-monzo',
  'ob-barclays',
  'ob-virgin-money',
  'oauth-starling',
  'ob-first-direct',
  'ob-bos',
  'ob-nationwide',
  'ob-revolut',
  'mock',
];

/**
 * We only support providers with the following criteria:
 *  - Based in the UK
 *  - Has the 'accounts' scope
 *  - Well known provider in the UK
 */
const filterProviders = (provider) =>
  provider.country === 'uk' &&
  SUPPORTED_PROVIDERS.includes(provider.provider_id);

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

export const retrieveUserProviders = (event: APIGatewayEvent) =>
  base(async (sequelize) => {
    const {
      pathParameters: { userId },
    } = event;

    const { Provider, User, Token } = sequelize.models;

    const user = await User.findOne({
      where: {
        cognito_id: userId,
      },
    });

    const tokens = await Token.findAll({
      where: { userId: user.id },
      attributes: ['id'],
      include: {
        model: Provider,
        attributes: ['id', 'name', 'providerId', 'country', 'logoUrl'],
      },
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

    const body = await trueLayerClient.getAccounts(tokens);

    console.log('Accounts retrieved from TrueLayer: ', JSON.stringify(body));

    return {
      body: {
        accounts: body.results,
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

    const body = await trueLayerClient.getAccountBalance(tokens, accountId);

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

    const body = await trueLayerClient.getAccountTransactions(
      tokens,
      accountId
    );

    console.log(
      'Account balance retrieved from TrueLayer: ',
      JSON.stringify(body)
    );

    return {
      body: {
        transactions: body.results,
      },
    };
  });
