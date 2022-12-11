import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { request } from '../util';

interface State {
    token: string | null;
    signin: (params: { username: string; password: string }) => Promise<void>;
    signup: (params: { username: string; email: string; password: string }) => Promise<void>;
    signout: () => void;
}

export const useAuthStore = create<State>()(
    immer((set) => ({
        token: null,

        signin: async (params) => {
            const data = await request('POST', '/auth/login', null, params);
            console.debug('signin response:', data);

            // TODO: validate types
            set((state) => {
                state.token = data.token as string;
            });
        },
        signup: async (params) => {
            const data = await request('POST', '/auth/register', null, params);
            console.debug('signup response:', data);

            // TODO: validate types
            set((state) => {
                state.token = data.token as string;
            });
        },
        signout: () => {
            set((state) => {
                state.token = null;
            });
        },
    }))
);

// NOTE: This isn't a hook, it accesses the state directly and is not reactive.
// For auth tokens, this is fine, but generally hooks should be used
export function getToken() {
    return useAuthStore.getState().token;
}
