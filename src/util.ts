import { JSONObject } from './types';

// TODO: make this configurable somehow?
const BASE_URL = 'http://10.0.2.2:3001/api';

export async function request(
  method: string,
  route: string,
  token: string | null,
  data?: JSONObject
): Promise<JSONObject> {
  const url = `${BASE_URL}/${route}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: headers,
  });
  if (response.status !== 200) {
    // TODO: throw error with status/message/body/etc attributes
    throw new Error(`invalid response status: ${response.status}`);
  }

  return (await response.json()) as JSONObject;
}
