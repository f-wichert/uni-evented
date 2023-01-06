import { unstable_batchedUpdates as batchedUpdates } from 'react-native';
import create, { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { log } from './log';

// https://github.com/pmndrs/zustand/blob/main/docs/guides/how-to-reset-state.md
const resetters: (() => void)[] = [];

// This is basically zustand's `create()`, but with the `immer` and `log` middlewares applied by default.
// Partially based on https://github.com/pmndrs/zustand/issues/1242.

export const createStore = <T>(
    name: string,
    options: {
        // Whether this store shouldn't get reset by `resetAllStores()`
        skipReset?: boolean;
    } = { skipReset: false }
) => {
    return <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
        f: StateCreator<T, [['zustand/immer', never]], Mos>
    ) => {
        const store = create<T>()(subscribeWithSelector(immer(log(f, name))));
        if (options.skipReset !== true) {
            const initialState = store.getState();
            resetters.push(() => store.setState(initialState, true));
        }
        return store;
    };
};

export const resetAllStores = () => {
    console.debug('resetting all stores');
    // `batchedUpdates` seemed like a good idea here but may not actually be needed, not 100% sure.
    batchedUpdates(() => {
        for (const resetter of resetters) {
            resetter();
        }
    });
};
