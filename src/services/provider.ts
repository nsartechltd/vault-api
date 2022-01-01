import fetch from 'node-fetch';
import type { APIGatewayEvent } from 'aws-lambda';

import base from './base';
import config from '../config';

type Provider = {
  provider_id: string;
  display_name: string;
  country: string;
  logo_url: string;
  scopes: string[];
};

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
    const {
      trueLayer: { apiUrl, clientId },
    } = config;

    const response = await fetch(
      `${apiUrl}/api/providers?clientId=${clientId}`
    );
    const body: Provider[] = await response.json();

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

    const { Provider, Token } = sequelize.models;

    const providers = await Token.findAll({
      where: { userId },
      attributes: ['id'],
      include: Provider,
    });

    return {
      body: {
        providers,
      },
    };
  });
