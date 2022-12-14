import * as SecureStore from 'expo-secure-store';
import { LatLng } from 'react-native-maps';
import { persist, StateStorage } from 'zustand/middleware';

import { CurrentUser } from '../models';
import { handleError, request } from '../util';
import { createStore } from './utils/createStore';

interface State {
    token: string | null;
    user: CurrentUser | null;
    signin: (params: { username: string; password: string }) => Promise<void>;
    signup: (params: { username: string; email: string; password: string }) => Promise<void>;
    signout: () => void;
    reset: (params: { email: string }) => Promise<void>;

    fetchUser: () => Promise<void>;

    createEvent: (params: {
        name: string;
        location: LatLng;
        startDate?: Date;
        endDate?: Date;
    }) => Promise<void>;
    closeEvent: () => void;
    joinEvent: (params: { eventId: string }) => Promise<void>;
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
                await request('POST', '/auth/reset', null, params);

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

            createEvent: async (params) => {
                const data = await request('POST', '/event/create', getToken(), {
                    name: params.name,
                    lat: params.location.latitude,
                    lon: params.location.longitude,
                    startDateTime: params.startDate?.toJSON() ?? null,
                    endDateTime: params.endDate?.toJSON() ?? null,
                });
                console.debug('createEvent response:', data);

                await request('POST', '/event/join', getToken(), {
                    eventId: data.eventId,
                    lat: 0,
                    lon: 0,
                });

                set((state) => {
                    if (!state.user) {
                        console.warn('No current user stored, cannot set event ID');
                        return;
                    }
                    state.user.currentEventId = data.eventId as string;
                });
            },
            closeEvent: () => {
                set((state) => {
                    if (!state.user) {
                        console.warn('No current user stored, cannot clear event ID');
                        return;
                    }
                    state.user.currentEventId = null;
                });
            },
            joinEvent: async (params) => {
                console.log(JSON.stringify(params));

                const joinedEvent = await request('post', '/event/join', getToken(), {
                    eventId: params.eventId,
                    lon: 0,
                    lat: 0,
                });

                set((state) => {
                    if (!state.user) {
                        console.warn('No current user stored, cannot clear event ID');
                    }
                    state.user.currentEventId = params.eventId;
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

        // clear stored user if token changed
        useAuthStore.setState((state) => {
            state.user = null;
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
    },
    { fireImmediately: true }
);

export function useCurrentUser() {
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
