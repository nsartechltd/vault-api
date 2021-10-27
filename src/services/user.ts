import { APIGatewayEvent } from 'aws-lambda';
import { Sequelize } from 'sequelize/types';

import base from './base';

const parseProviderForAPI = (provider) => ({
  name: provider.Provider.name,
});

export const retrieveProviders = async (event: APIGatewayEvent) =>
  base(async (sequelize: Sequelize) => {
    console.log('Event receieved: ', JSON.stringify(event));

    const { userId } = event.pathParameters;

    const { Provider, UserProvider } = sequelize.models;

    const providers = await UserProvider.findAll({
      where: {
        userId,
      },
      include: Provider,
    });

    console.log('Providers found for user: ', JSON.stringify(providers));

    return {
      body: {
        providers: providers.map(parseProviderForAPI),
      },
    };
  });
