import config from './config';
import { JSONObject } from './types';

export async function request(
    method: string,
    route: string,
    token: string | null,
    data?: JSONObject | FormData
): Promise<JSONObject> {
    const url = `${config.BASE_URL}/${route}`;

    const headers: Record<string, string> = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let body: FormData | string | null = null;
    if (data instanceof FormData) {
        headers['Content-Type'] = 'multipart/form-data';
        body = data;
    } else if (typeof data === 'object') {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(data);
    }

    const response = await fetch(url, {
        method: method,
        body: body,
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
