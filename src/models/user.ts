import { JSONObject } from '../types';

export interface UserResponse extends JSONObject {
    id: string;
    username: string;
    displayName: string | null;
}

export default class User {
    readonly id: string;
    readonly username: string;
    readonly displayName: string;

    constructor({
        id,
        username,
        displayName,
    }: {
        id: string;
        username: string;
        displayName?: string | null;
    }) {
        this.id = id;
        this.username = username;
        this.displayName = displayName || username;
    }

    static fromUserResponse(response: UserResponse) {
        return new User(response);
    }

    async fromId(id: string) {
        // TODO
    }
}
