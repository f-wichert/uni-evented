import { WritableDraft } from 'immer/dist/types/types-external';
import { useCallback, useEffect } from 'react';

import { CurrentUser, CurrentUserResponse, User, UserResponse } from '../models';
import { request, useAsync } from '../util';
import { useEventStore } from './event';
import { createStore } from './utils/createStore';

interface State {
    users: Readonly<{ [id: string]: User | CurrentUser }>;
    currentUserId: string | null;

    fetchUser: (id: string) => Promise<User>;
    fetchCurrentUser: () => Promise<CurrentUser>;
}

export const useUserStore = createStore<State>('user')((set, get) => ({
    users: {},
    currentUserId: null,

    fetchUser: async (id: string | '@me') => {
        // TODO: validate types
        const user = await request<UserResponse>('GET', `/user/${id}`);

        set((state) => {
            addUsers(state, user);
        });

        return user;
    },
    fetchCurrentUser: async () => {
        const user = (await get().fetchUser('@me')) as CurrentUserResponse;

        set((state) => {
            state.currentUserId = user.id;
        });
        useEventStore.setState((state) => {
            state.currentEventId = user.currentEventId ?? null;
        });

        return user;
    },
}));

/** Helper for adding users to state, merging new data with existing data. */
export function addUsers(state: WritableDraft<State>, users: User | User[]) {
    if (!Array.isArray(users)) users = [users];

    for (const user of users) {
        state.users[user.id] = {
            // (shallow) merge old and new user data
            // TODO: this probably causes unnecessary renders if the
            //       data didn't actually change, maybe use tracked state thingy?
            ...state.users[user.id],
            ...user,
        };
    }
}

export function useCurrentUser() {
    const userId = useUserStore((state) => state.currentUserId);
    if (!userId) throw new Error('No userId stored.');

    const user = useUserStore((state) => state.users[userId]);
    if (!user) throw new Error("User is not stored, this shouldn't happen.");
    return user as CurrentUser;
}

export function useUser(id: string): User | undefined {
    return useUserStore((state) => state.users[id]);
}

export function useUserFetch(id: string) {
    if (!id) throw new Error(`Invalid user ID: ${id}`);
    const fetchFunc = useCallback(async () => {
        // this already adds the user to the store
        await useUserStore.getState().fetchUser(id);
    }, [id]);

    const { refresh, loading, value: _ignored, ...rest } = useAsync(fetchFunc, false);

    const user = useUser(id);
    useEffect(() => {
        // if user isn't stored already, start fetching it
        if (!user) {
            refresh();
        }
    }, [user, refresh]);

    return { refresh, loading, user, ...rest };
}
