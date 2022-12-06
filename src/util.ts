import { JSONObject } from './types';

// TODO: make this configurable somehow?
const BASE_URL = 'http://192.168.0.10:3000/api';
// const BASE_URL = 'http://10.0.2.2:3001/api'

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

export async function requestData(
    method: string,
    route: string,
    token: string | null,
    data?: JSONObject
): Promise<JSONObject> {
    const url = `${BASE_URL}/${route}`;

    const headers: Record<string, string> = {
        // 'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: method,
        body: data, //JSON.stringify(data),
        headers: headers,
    });
    if (response.status !== 200) {
        // TODO: throw error with status/message/body/etc attributes
        throw new Error(`invalid response status: ${response.status}`);
    }

    return (await response.json()) as JSONObject;
}

// used for passing async functions to react event handlers like `onPress`
// TODO: display some kind of message to the user if there's an error here?
export function asyncHandler<Args extends unknown[]>(
    handler: (...args: Args) => Promise<void>
): (...args: Args) => void {
    return (...args) => void handler(...args);
}
