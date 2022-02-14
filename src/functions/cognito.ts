import type { APIGatewayEvent } from 'aws-lambda';

import { storeUserData } from '../services/cognito';

export const getProviders = async (event: APIGatewayEvent) =>
  storeUserData(event);
