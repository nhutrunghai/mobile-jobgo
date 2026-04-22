export type AuthTokens = {
  AccessToken: string;
  RefreshToken: string;
};

export type AuthSuccessData = {
  id: string;
} & AuthTokens;

export type ApiEnvelope<T> = {
  status: string;
  message: string;
  data: T;
};
