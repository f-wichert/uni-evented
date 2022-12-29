import { CurrentUser } from './user';

export interface AuthInfoData {
    readonly user: CurrentUser;
    readonly currentEventId: string | null;
}
