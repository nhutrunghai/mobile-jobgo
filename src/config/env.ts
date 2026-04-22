import Constants from 'expo-constants';

type ExpoExtra = {
  apiBaseUrl?: string;
};

const expoExtra = (Constants.expoConfig?.extra ?? {}) as ExpoExtra;
const DEFAULT_API_BASE_URL = 'http://192.168.102.9:4000/api/v1';

function normalizeBaseUrl(value: string | undefined) {
  if (!value) {
    return DEFAULT_API_BASE_URL;
  }

  return value.replace(/\/+$/, '');
}

export const API_BASE_URL = normalizeBaseUrl(expoExtra.apiBaseUrl);
export const SERVER_URL = API_BASE_URL.replace(/\/api\/v\d+$/, '');
export const UPLOADTHING_URL = `${SERVER_URL}/api/uploadthing`;
