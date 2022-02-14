import type { APIGatewayEvent } from 'aws-lambda';

import { storeUserData } from '../services/cognito';

export const storeUser = async (event: APIGatewayEvent) => storeUserData(event);
