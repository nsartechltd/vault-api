import { APIGatewayEvent } from 'aws-lambda';

import { retrieveProviders } from '../services/user';

export const getProviders = async (event: APIGatewayEvent) =>
  retrieveProviders(event);
