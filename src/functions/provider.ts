import type { APIGatewayEvent } from 'aws-lambda';

import { retrieveProviders, retrieveUserProviders } from '../services/provider';

export const getProviders = async () => retrieveProviders();
export const getUserProviders = async (event: APIGatewayEvent) =>
  retrieveUserProviders(event);
