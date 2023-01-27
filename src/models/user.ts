import urlJoin from 'url-join';

import config from '../config';
import { addUsers, useUserStore } from '../state/user';
import { request } from '../util';

export const EventAttendeeStatuses = ['interested', 'attending', 'left', 'banned'] as const;
export type EventAttendeeStatus = typeof EventAttendeeStatuses[number];

export interface PartialAttendee {
    status: EventAttendeeStatus;
}

export interface UserResponse {
    readonly id: string;
    readonly username: string;
    readonly displayName: string;
    readonly avatarHash: string | null;
    readonly isAdmin: boolean;
    readonly eventAttendee?: PartialAttendee;
}

export interface User {
    readonly id: string;
    readonly username: string;
    readonly displayName: string;
    readonly avatarHash: string | null;
    readonly isAdmin: boolean;
    readonly eventAttendee?: PartialAttendee;
}

export interface CurrentUser extends User {
    readonly email: string;
}

export interface CurrentUserResponse extends CurrentUser {
    readonly currentEventId: string | null;
}

export interface AuthResponse {
    token: string;
}

export class UserManager {
    static fromUserResponse(response: UserResponse): User {
        // currently just a no-op
        return { ...response };
    }

    static getAvatarUrl(user: User): string | null {
        if (!user.avatarHash) return null;
        return urlJoin(config.BASE_URL, 'media', 'avatar', user.id, user.avatarHash, 'high.jpg');
    }

    static async editSelf(params: {
        // base64-encoded image
        avatar?: string | null;
        username?: string;
        displayName?: string;

        // account fields
        email?: string;
        password?: string;
    }) {
        const user = await request<CurrentUserResponse>('PATCH', '/user/@me', params);

        useUserStore.setState((state) => {
            addUsers(state, this.fromUserResponse(user));
        });
    }

    static async registerPush(token: string) {
        await request('POST', '/auth/registerPush', { token });
    }

    static async unregisterPush(token: string) {
        await request('POST', '/auth/unregisterPush', { token }, { noAuth: true });
    }
}
