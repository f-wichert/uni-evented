import { JSONObject } from '../types';

export interface UserResponse extends JSONObject {
    readonly id: string;
    readonly username: string;
    readonly displayName: string | null;
}

export interface User {
    readonly id: string;
    readonly username: string;
    readonly displayName: string;
}

export interface CurrentUser extends User {
    readonly token: string;
    readonly email: string;
}

export class UserManager {
    static fromUserResponse(response: UserResponse) {
        return { ...response, displayName: response.displayName || response.username };
    }

    static async fromId(id: string) {
        // TODO
    }
}
