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

    const { Account, Asset, Token, Transaction, User } = sequelize.models;

    const { connector_id: providerId } = jwt.decode(body.access_token);

    console.log('Sequelize: ', sequelize);

    const transaction = await sequelize.transaction();

    try {
      const user = await User.findOne({
        where: {
          cognitoId: userId,
        },
        transaction,
      });

      if (!user) {
        throw new NotFoundError(`User with Cognito ID: '${userId}' not found.`);
      }

      console.log('User found: ', JSON.stringify(user));

      const token = await Token.findOne({
        where: {
          userId: user.id,
          providerId,
        },
        transaction,
      });

      await token.update(
        {
          accessToken: body.access_token,
          refreshToken: body.refresh_token,
          expiry: body.expiry_time,
          scope: body.scope,
        },
        { transaction }
      );

      const { results: accounts } = await trueLayerClient.getAccounts({
        providerId,
        userId: user.id,
        tokens: {
          accessToken: body.access_token,
          refreshToken: body.refresh_token,
        },
      });

      await Promise.all(
        accounts.map(async (account) => {
          const asset = await Asset.create(
            {
              type: 'account',
              accountId: account.account_id,
              tokenId: token.id,
            },
            {
              transaction,
            }
          );

          await Account.create(
            {
              type: account.account_type,
              name: account.display_name,
              currency: account.currency,
              accountNumber: account.account_number.number,
              sortCode: account.account_number.sort_code,
              iban: account.account_number.iban,
              bic: account.account_number.bic
              assetId: asset.id,
            },
            { transaction }
          );

          const { results: transactions } =
            await trueLayerClient.getAccountTransactions({
              providerId,
              userId: user.id,
              tokens: {
                accessToken: body.access_token,
                refreshToken: body.refresh_token,
              },
              accountId: account.account_id,
            });

          await Promise.all(
            transactions.map(
              async (t) =>
                await Transaction.create(
                  {
                    transactionId: t.transaction_id,
                    normalisedProviderTransactionId:
                      t.normalised_provider_transaction_id,
                    providerTransactionId: t.provider_transaction_id,
                    timestamp: t.timestamp,
                    description: t.description,
                    amount: t.amount,
                    currency: t.currency,
                    type: t.transaction_type,
                    classification: t.transaction_classification.join(', '),
                    category: t.transaction_category,
                    merchant: t.merchant_name,
                    balanceAmount: t.running_balance.amount,
                    balanceCurrency: t.running_balance.currency,
                    meta: JSON.stringify(t.meta),
                    assetId: asset.id,
                  },
                  { transaction }
                )
            )
          );
        })
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();

      console.log('Error authentication provider: ', JSON.stringify(err));

      return {
        statusCode: 500,
        body: {
          message: err.message,
        },
      };
    }

    return {
      statusCode: 204,
    };
  });
