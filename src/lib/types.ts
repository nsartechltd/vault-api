export type Provider = {
  provider_id: string;
  display_name: string;
  country: string;
  logo_url: string;
  scopes: string[];
};

export type Providers = Provider[];

type Tokens = {
  refreshToken: string;
  accessToken: string;
};

export type UserData = {
  providerId: string;
  userId: number;
  tokens: Tokens;
  accountId?: string;
};
