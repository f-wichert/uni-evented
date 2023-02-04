import { WritableDraft } from 'immer/dist/types/types-external';
import { useCallback, useEffect } from 'react';

import { CurrentUser, CurrentUserResponse, User, UserManager, UserResponse } from '../models';
import { request, useAsync } from '../util';
import { useEventStore } from './event';
import { createStore } from './utils/createStore';

interface State {
    users: Readonly<{ [id: string]: User | CurrentUser }>;
    currentUserId: string | null;

    fetchUser: (id: string, details?: boolean) => Promise<UserResponse>;
    fetchCurrentUser: (details?: boolean) => Promise<CurrentUserResponse>;
}

export const useUserStore = createStore<State>('user')((set, get) => ({
    users: {},
    currentUserId: null,

    fetchUser: async (id: string | '@me', details?: boolean) => {
        const query = details ? { details: true } : null;
        const user = await request<UserResponse>('GET', `/user/${id}`, query);

        set((state) => {
            addUsers(state, UserManager.fromUserResponse(user));
        });

        return user;
    },
    fetchCurrentUser: async (details?: boolean) => {
        const user = (await get().fetchUser('@me', details)) as CurrentUserResponse;

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

// note: this doesn't automatically fetch detail data if the user is already cached, even if we don't have detail data
export function useUserFetch(id: string, details?: boolean) {
    if (!id) throw new Error(`Invalid user ID: ${id}`);
    const fetchFunc = useCallback(async () => {
        // this already adds the user to the store
        const data = await useUserStore.getState().fetchUser(id, details);
        return data.details;
    }, [id, details]);

    const { refresh, loading, value: detailData, ...rest } = useAsync(fetchFunc, false);

    const user = useUser(id);
    useEffect(() => {
        // if user isn't stored already, start fetching it
        if (!user) {
            refresh();
        }
    }, [user, refresh]);

    return { refresh, loading, user, details: detailData, ...rest };
}
