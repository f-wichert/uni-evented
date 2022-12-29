import * as SecureStore from 'expo-secure-store';
import { persist, StateStorage } from 'zustand/middleware';

import { AuthInfoData } from '../models';
import { handleError, request } from '../util';
import { useEventStore } from './event';
import { useUserStore } from './user';
import { createStore } from './utils/createStore';

interface State {
    token: string | null;
    userId: string | null;

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
        (set) => ({
            token: null,
            userId: null,

            signin: async (params) => {
                const data = await request('POST', '/auth/login', params, { noAuth: true });

                // TODO: validate types
                set((state) => {
                    state.token = data.token as string;
                });
            },
            signup: async (params) => {
                const data = await request('POST', '/auth/register', params, { noAuth: true });

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
                await request('POST', '/auth/reset', params, { noAuth: true });

                set((state) => {
                    state.token = null;
                });
            },

            fetchUser: async () => {
                // TODO: validate types
                const { user, currentEventId } = (await request(
                    'GET',
                    '/auth/info'
                )) as unknown as AuthInfoData;

                useEventStore.setState((state) => {
                    state.currentEventId = currentEventId;
                });
                useUserStore.setState((state) => {
                    state.users[user.id] = user;
                });
                set((state) => {
                    state.userId = user.id;
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

// TODO: use computed property? https://github.com/pmndrs/zustand/discussions/1363#discussioncomment-3874571
useAuthStore.subscribe(
    (state) => state.token,
    (token) => {
        // clear stored users if token changed
        useAuthStore.setState((state) => {
            state.userId = null;
        });
        useUserStore.setState((state) => {
            state.users = {};
        });

        // start fetching user data if there's a new token
        if (token) {
            useAuthStore
                .getState()
                .fetchUser()
                .catch((e) => {
                    handleError(e, { prefix: 'Failed to retrieve user data' });
                    // reset token if we failed to fetch the user data
                    // TODO: show a 'try again' button instead
                    useAuthStore.setState((state) => {
                        state.token = null;
                    });
                });
        }
    }
);

// NOTE: This isn't a hook, it accesses the state directly and is not reactive.
// For auth tokens, this is fine, but generally hooks should be used
export function getToken() {
    return useAuthStore.getState().token;
}
