import type { APIGatewayEvent } from 'aws-lambda';

import {
  retrieveProviders,
  authenticateProvider,
  retrieveUserProviders,
  retrieveUserProviderAccounts,
  retrieveUserProviderAccountBalance,
  retrieveUserProviderAccountTransactions,
} from '../services/provider';

export const getProviders = async () => retrieveProviders();
export const authProvider = async (event: APIGatewayEvent) =>
  authenticateProvider(event);
export const getUserProviders = async (event: APIGatewayEvent) =>
  retrieveUserProviders(event);
export const getUserProviderAccounts = async (event: APIGatewayEvent) =>
  retrieveUserProviderAccounts(event);
export const getUserProviderAccountBalance = async (event: APIGatewayEvent) =>
  retrieveUserProviderAccountBalance(event);
export const getUserProviderAccountTransactions = async (
  event: APIGatewayEvent
) => retrieveUserProviderAccountTransactions(event);
