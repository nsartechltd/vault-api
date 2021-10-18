import type { APIGatewayEvent } from 'aws-lambda';

export const redirect = (event: APIGatewayEvent) => {
  console.log('TRUE LAYER EVENT', JSON.stringify(event));
};