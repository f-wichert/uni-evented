import { getDiff } from 'recursive-diff';
import { StateCreator, StoreMutatorIdentifier } from 'zustand';
import config from '../../config';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
function diff(oldVal: unknown, newVal: unknown) {
    const results = getDiff(oldVal, newVal, true);
    // format result a bit differently
    return Object.fromEntries(
        results.map((r) => {
            const { path, ...rest } = r;
            return [path.join('.'), rest];
        })
    );
}
/* eslint-enable @typescript-eslint/no-unsafe-assignment */

// Logging middleware for zustand stores.
// To be used like: `create<State>()(log((set) => {...}))`.
// Parts of this were taken from:
// https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#middleware-that-doesnt-change-the-store-type

type Logger = <
    T,
    Mps extends [StoreMutatorIdentifier, unknown][] = [],
    Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
    f: StateCreator<T, Mps, Mcs>,
    name: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T>(f: StateCreator<T, [], []>, name: string) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
    if (config.ENABLE_STATE_DEBUG) {
        store.setState = (...args) => {
            const old = get();
            set(...args);

            const changes = diff(old, get());
            if (Object.keys(changes).length) console.debug(`state update (${name}):`, changes);
        };
    }

    return f(store.setState, get, store);
};

export const log = loggerImpl as Logger;
