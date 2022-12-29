import { CurrentUser, User } from '../models';
import { useAuthStore } from './auth';
import { createStore } from './utils/createStore';

interface State {
    users: { [id: string]: User | CurrentUser };
}

export const useUserStore = createStore<State>('user')((set) => ({
    users: {},
}));

export function useCurrentUser() {
    const userId = useAuthStore((state) => state.userId);
    if (!userId) throw new Error('No userId stored.');

    const user = useUserStore((state) => state.users[userId]);
    if (!user) throw new Error("User is not stored, this shouldn't happen.");
    return user as CurrentUser;
}
