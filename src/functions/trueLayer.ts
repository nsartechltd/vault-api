import type { APIGatewayEvent, Callback } from 'aws-lambda';

import { authenticateProvider } from '../services/trueLayer';

export const authCallback = async (
  event: APIGatewayEvent,
  _,
  callback: Callback
) => authenticateProvider(event, callback);
