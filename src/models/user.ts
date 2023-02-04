import urlJoin from 'url-join';

import config from '../config';
import { addUsers, useUserStore } from '../state/user';
import { request } from '../util';

export const EventAttendeeStatuses = ['interested', 'attending', 'left', 'banned'] as const;
export type EventAttendeeStatus = typeof EventAttendeeStatuses[number];

export type FollowType = 'following' | 'followers';

export interface PartialAttendee {
    status: EventAttendeeStatus;
}

export interface UserResponse {
    readonly id: string;
    readonly username: string;
    readonly displayName: string;
    readonly avatarHash: string | null;
    readonly isAdmin: boolean;
    readonly bio: string;
    readonly eventAttendee?: PartialAttendee;
    readonly details?: UserDetails;
}

export interface User {
    readonly id: string;
    readonly username: string;
    readonly displayName: string;
    readonly avatarHash: string | null;
    readonly isAdmin: boolean;
    readonly bio: string;
    readonly eventAttendee?: PartialAttendee;
}

export interface CurrentUser extends User {
    readonly email: string;
    readonly favouriteTags: string[];
    readonly recommendationSettings: RecommendationSettings;
}

export interface RecommendationSettings {
    DistanceWeight: number;
    TagIntersectionWeight: number;
    FolloweeIntersectionWeight: number;
    AverageEventRatingWeight: number;
    NumberOfMediasWeigth: number;
}

export interface UserDetails {
    numFollowing: number;
    numFollowers: number;
    numEvents: number;
}

export interface CurrentUserResponse extends UserResponse {
    currentEventId: string | null;
    email: string;
    favouriteTags?: string[];
    recommendationSettings?: RecommendationSettings;
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
        bio?: string;
        favouriteTags?: string[];

        // account fields
        email?: string;
        password?: string;
    }) {
        const userData = await request<CurrentUserResponse>('PATCH', '/user/@me', params);

        useUserStore.setState((state) => {
            if (params.favouriteTags)
                // we don't get this data back from the server
                userData.favouriteTags = params.favouriteTags;

            addUsers(state, this.fromUserResponse(userData));
        });
    }

    static async registerPush(token: string) {
        await request('POST', '/auth/registerPush', { token });
    }

    static async unregisterPush(token: string) {
        await request('POST', '/auth/unregisterPush', { token }, { noAuth: true });
    }

    static async fetchFollows(userId: string, type: FollowType) {
        const data = await request<UserResponse[]>('GET', `/user/${userId}/${type}`);
        return data.map((u) => this.fromUserResponse(u));
    }
}
