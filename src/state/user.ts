import { CurrentUser, CurrentUserResponse, User } from '../models';
import { request } from '../util';
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
        const user = (await request('GET', `/user/${id}`)) as unknown as User;

        set((state) => {
            state.users[user.id] = user;
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

export function useCurrentUser() {
    const userId = useUserStore((state) => state.currentUserId);
    if (!userId) throw new Error('No userId stored.');

    const user = useUserStore((state) => state.users[userId]);
    if (!user) throw new Error("User is not stored, this shouldn't happen.");
    return user as CurrentUser;
}
