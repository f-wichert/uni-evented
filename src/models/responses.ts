import { CurrentUser } from './user';

export interface CurrentUserResponse extends CurrentUser {
    readonly currentEventId: string | null;
}
