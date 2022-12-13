import * as SecureStore from 'expo-secure-store';
import { persist, StateStorage } from 'zustand/middleware';

import { CurrentUser } from '../models';
import { request } from '../util';
import { createStore } from './utils/createStore';

interface State {
    token: string | null;
    user: CurrentUser | null;
    signin: (params: { username: string; password: string }) => Promise<void>;
    signup: (params: { username: string; email: string; password: string }) => Promise<void>;
    signout: () => void;
    reset: (params: { email: string }) => Promise<void>;
    fetchUser: () => Promise<void>;
}

// TODO: show loading state while waiting for hydration: https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#hydration-and-asynchronous-storages
// TODO: SecureStore doesn't work on web, may be the only blocker
const secureStoreWrapper: StateStorage = {
    getItem: SecureStore.getItemAsync.bind(SecureStore),
    setItem: SecureStore.setItemAsync.bind(SecureStore),
    removeItem: SecureStore.deleteItemAsync.bind(SecureStore),
};

export const useAuthStore = createStore<State>('auth')(
    persist(
        (set, get) => ({
            token: null,
            // consider using `useUser()` instead
            user: null,

            signin: async (params) => {
                console.log('SubmitSignin');
                const data = await request('POST', '/auth/login', null, params);

                // TODO: validate types
                set((state) => {
                    state.token = data.token as string;
                });
            },
            signup: async (params) => {
                const data = await request('POST', '/auth/register', null, params);

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
            reset: async (params) => {
                const data = await request('POST', '/auth/reset', null, params);
                // console.log(JSON.stringify(data));
                // if (data.responseCode == '10') {

                // }
                set((state) => {
                    state.token = null;
                });
            },

            fetchUser: async () => {
                // TODO: validate types
                const user = await request('GET', '/auth/info', get().token);

                set((state) => {
                    state.user = user as unknown as CurrentUser;
                });
            },
        }),
        {
            name: 'auth',
            getStorage: () => secureStoreWrapper,
            partialize: (state) => ({ token: state.token }),
        }
    )
);

useAuthStore.subscribe(
    (state) => state.token,
    (token) => {
        // TODO: this might be bad practice: https://github.com/pmndrs/zustand/discussions/1363#discussioncomment-3874571
        // TODO: error handling
        useAuthStore.setState((state) => {
            // clear stored user if token changed
            state.user = null;
            // start fetching user data if there's a new token
            if (token) {
                void state.fetchUser();
            }
        });
    },
    { fireImmediately: true }
);

export function useUser() {
    const token = useAuthStore((state) => state.token);
    if (!token) throw new Error('No token stored.');

    const user = useAuthStore((state) => state.user);
    if (!user) throw new Error("User is not stored, this shouldn't happen.");
    return user;
}

// NOTE: This isn't a hook, it accesses the state directly and is not reactive.
// For auth tokens, this is fine, but generally hooks should be used
export function getToken() {
    return useAuthStore.getState().token;
}
