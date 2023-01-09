import urlJoin from 'url-join';

import config from '../config';
import { addUsers, useUserStore } from '../state/user';
import { request } from '../util';

export interface UserResponse {
    readonly id: string;
    readonly username: string;
    readonly displayName: string;
    readonly avatarHash: string | null;
}

export interface User {
    readonly id: string;
    readonly username: string;
    readonly displayName: string;
    readonly avatarHash: string | null;
}

export interface CurrentUser extends User {
    readonly email: string;
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
        avatar?: string;
    }) {
        const user = (await request('PATCH', '/user/@me', params)) as unknown as UserResponse;

        useUserStore.setState((state) => {
            addUsers(state, this.fromUserResponse(user));
        });
    }
}
