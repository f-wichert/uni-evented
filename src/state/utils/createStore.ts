import create, { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { log } from './log';

// This is basically zustand's `create()`, but with the `immer` and `log` middlewares applied by default.
// Partially based on https://github.com/pmndrs/zustand/issues/1242.

export const createStore = <T>(name: string) => {
    return <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
        f: StateCreator<T, [['zustand/immer', never]], Mos>
    ) => {
        return create<T>()(subscribeWithSelector(immer(log(f, name))));
    };
};
