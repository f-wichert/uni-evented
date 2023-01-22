import Constants from 'expo-constants';
import urlJoin from 'url-join';

import { DependencyList, useCallback, useEffect, useState } from 'react';
import config from './config';
import { getToken } from './state/auth';

export const baseHeaders = Object.freeze({
    // Currently required to access main API
    'Client-ID': `evented/${Constants.expoConfig?.version}`,
});

export async function request<ResponseType>(
    method: string,
    route: string,
    data?: FormData | object | null,
    options?: {
        // Whether to not send an auth token.
        // (by default, all requests are sent with the token)
        noAuth?: true;
    }
): Promise<ResponseType> {
    // join given route to base url, removing leading `/` if exists
    const url = urlJoin(config.BASE_URL, 'api', route.replace(/^\//, ''));

    const headers: Record<string, string> = { ...baseHeaders };

    // add token header of `noAuth` isn't specified
    if (options?.noAuth !== true) {
        const token = getToken();
        if (!token) {
            // If this happens, either something went very wrong,
            // or the method call should use `noAuth: true`.
            console.warn(`Expected token to be set for '${method} ${route}'`);
        }
        headers['Authorization'] = `Bearer ${getToken()}`;
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
        throw new Error(`invalid response status for '${method} ${route}': ${response.status}`);
    }

    // NOTE: this is not valiated at runtime
    return (await response.json()) as ResponseType;
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

export function useAsync<T>(func: () => Promise<T>, immediate = true) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [value, setValue] = useState<T | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            setValue(await func());
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [func]) as () => void;

    useEffect(() => {
        if (immediate) refresh();
    }, [refresh, immediate]);

    return { loading, error, value, refresh };
}

// can't name this `useAsyncEffect` since the eslint plugin checks for /Effect($|[^a-z])/ and we don't want to match that
export function useAsyncEffects(
    handler: () => Promise<void>,
    deps: DependencyList,
    opts: ErrorHandlerParams = {}
): void {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => asyncHandler(handler, opts)(), deps);
}

export function useAsyncCallback<Args extends unknown[]>(
    handler: (...args: Args) => Promise<void>,
    deps: DependencyList,
    opts: ErrorHandlerParams = {}
): (...args: Args) => void {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback((...args: Args) => asyncHandler(handler, opts)(...args), deps);
}

export function notEmpty<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}
