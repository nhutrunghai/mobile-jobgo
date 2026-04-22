import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'auth.access_token';
const REFRESH_TOKEN_KEY = 'auth.refresh_token';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
};

type Listener = () => void;

let state: AuthState = {
  accessToken: null,
  refreshToken: null,
  hydrated: false,
};

const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setState(nextState: Partial<AuthState>) {
  state = {
    ...state,
    ...nextState,
  };
  emitChange();
}

export function subscribeAuthState(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAuthState() {
  return state;
}

export function getAccessToken() {
  return state.accessToken;
}

export function getRefreshToken() {
  return state.refreshToken;
}

export function hasAuthTokens() {
  return Boolean(state.accessToken && state.refreshToken);
}

export async function hydrateAuthTokens() {
  if (state.hydrated) {
    return state;
  }

  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  ]);

  setState({
    accessToken,
    refreshToken,
    hydrated: true,
  });

  return getAuthState();
}

export async function setAuthTokens(tokens: AuthTokens) {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
  ]);

  setState({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    hydrated: true,
  });
}

export async function clearAuthTokens() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);

  setState({
    accessToken: null,
    refreshToken: null,
    hydrated: true,
  });
}
