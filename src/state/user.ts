import { CurrentUser, User } from '../models';
import { createStore } from './utils/createStore';

interface State {
    users: { [id: string]: User | CurrentUser };
    currentUserId: string | null;

    setCurrentUser: (user: CurrentUser | null) => void;
    clear: () => void;
}

export const useUserStore = createStore<State>('user')((set) => ({
    users: {},
    currentUserId: null,

    setCurrentUser: (user) => {
        set((state) => {
            state.currentUserId = user?.id ?? null;
            if (user) {
                state.users[user.id] = user;
            }
        });
    },
    clear: () => {
        set((state) => {
            // TODO: maybe make this less repetitive?
            state.users = {};
            state.currentUserId = null;
        });
    },
}));

export function useCurrentUser() {
    const userId = useUserStore((state) => state.currentUserId);
    if (!userId) throw new Error('No userId stored.');

    const user = useUserStore((state) => state.users[userId]);
    if (!user) throw new Error("User is not stored, this shouldn't happen.");
    return user as CurrentUser;
}
