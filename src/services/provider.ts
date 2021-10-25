import { Sequelize } from 'sequelize/types';

import base from './base';

const parseProviderForAPI = (provider) => ({
  name: provider.name,
  trueLayerId: provider.trueLayerId,
});

export const retrieveProviders = async () =>
  base(async (sequelize: Sequelize) => {
    const { Provider } = sequelize.models;

    const providers = await Provider.findAll();

    return {
      body: {
        providers: providers.map(parseProviderForAPI),
      },
    };
  });
