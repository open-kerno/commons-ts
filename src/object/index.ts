import { isUndefined } from 'es-toolkit/predicate';

export interface EncodeJSONParams<T> {
  jsonString: string;
  fallback?: T;
}

export const encodeJSON = <T>({ jsonString, fallback }: EncodeJSONParams<T>): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error(`Failed to decode JSON string:`, error);
    if (isUndefined(fallback)) {
      throw new Error('JSON_DECODING_ERROR');
    }
    return fallback;
  }
};
