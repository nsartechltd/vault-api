import type { APIGatewayEvent } from 'aws-lambda';

import { authenticateProvider } from '../services/trueLayer';

export const authCallback = async (event: APIGatewayEvent) =>
  authenticateProvider(event);
