import Constants from 'expo-constants';
import urlJoin from 'url-join';

import config from './config';
import { JSONObject } from './types';

export const baseHeaders = Object.freeze({
    // Currently required to access main API
    'Client-ID': `evented/${Constants.expoConfig?.version}`,
});

export async function request(
    method: string,
    route: string,
    token: string | null | undefined,
    data?: JSONObject | FormData
): Promise<JSONObject> {
    // join given route to base url, removing leading `/` if exists
    const url = urlJoin(config.BASE_URL, 'api', route.replace(/^\//, ''));

    const headers: Record<string, string> = { ...baseHeaders };
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

export interface ErrorHandlerParams {
    prefix?: string;
}

export function handleError(e: unknown, opts: ErrorHandlerParams = {}): void {
    let errStr = config.NODE_ENV === 'production' ? 'An error occurred' : `${e}`;
    if (opts.prefix) {
        errStr = `${opts.prefix}:\n${errStr}`;
    }
    toast.show(errStr, { type: 'danger' });
    console.error(e, e instanceof Error ? e.stack : undefined);
}

// Used for passing async functions to react event handlers like `onPress`.
// Automatically displays toast on screen in case of error.
export function asyncHandler<Args extends unknown[]>(
    handler: (...args: Args) => Promise<void>,
    opts: ErrorHandlerParams = {}
): (...args: Args) => void {
    return (...args) => {
        handler(...args).catch((e) => handleError(e, opts));
    };
}
