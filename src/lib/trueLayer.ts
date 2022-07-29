import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

import { updateUserToken } from './db';
import config from '../config';
import type { UserData } from './types';

const {
  trueLayer: { authUrl, apiUrl, clientId, clientSecret, redirectUrl },
} = config;

type Request = {
  method: string;
  headers: object;
  body?: unknown;
};

const request = async (
  method: string,
  url: string,
  headers = {},
  body = null
) => {
  const request: Request = {
    method,
    headers,
  };

  if (body) {
    request.body = body;
  }

  const response = await fetch(url, request);
  const data = await response.json();

  console.log('Data retrieved from TrueLayer: ', data);

  return data;
};

const authFetchRequest = (
  method: string,
  endpoint: string,
  headers = {},
  body = null
) => request(method, `${authUrl}/${endpoint}`, headers, body);

const apiFetchRequest = async (
  method: string,
  endpoint: string,
  userData: UserData,
  body = null
) => {
  let accessToken = userData.tokens.accessToken;

  const { exp: expiry } = jwt.decode(accessToken);
  const isTokenExpired = expiry * 1000 < Date.now();

  if (isTokenExpired) {
    console.log('Token is expired, refreshing.');

    const response = await refreshAccessToken(userData.tokens.refreshToken);
    await updateUserToken(userData.userId, userData.providerId, response);

    accessToken = response.access_token;
  }

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  return request(method, `${apiUrl}/data/v1/${endpoint}`, headers, body);
};

export const getAccessToken = async (code) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUrl);
  params.append('code', code);

  return await authFetchRequest('POST', 'connect/token', null, params);
};

export const refreshAccessToken = async (refreshToken: string) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUrl);
  params.append('refresh_token', refreshToken);

  return await authFetchRequest('POST', 'connect/token', null, params);
};

export const getProviders = async () =>
  authFetchRequest('GET', `api/providers?clientId=${clientId}`);

export const getAccounts = async (userData: UserData) =>
  apiFetchRequest('GET', 'accounts', userData);

export const getAccountBalance = async (userData: UserData) =>
  apiFetchRequest('GET', `accounts/${userData.accountId}/balance`, userData);

export const getAccountTransactions = async (userData: UserData) =>
  apiFetchRequest(
    'GET',
    `accounts/${userData.accountId}/transactions`,
    userData
  );
