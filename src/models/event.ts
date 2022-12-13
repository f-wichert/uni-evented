import { getToken } from '../state/auth';
import { JSONObject } from '../types';
import { request } from '../util';
import { Media, MediaManager, MediaResponse } from './media';
import { User, UserManager, UserResponse } from './user';

export const EventStatuses = ['scheduled', 'active', 'completed'] as const;
export type EventStatus = typeof EventStatuses[number];

export interface EventResponse extends JSONObject {
    readonly id: string;
    readonly name: string;
    readonly status: EventStatus;
    readonly lat: number;
    readonly lon: number;
    readonly hostId: string;
    readonly startDate: string;
    readonly endDate: string | null;
    readonly media: MediaResponse[] | null;
    readonly attendees: UserResponse[] | null;
    readonly currentAttendees: UserResponse[] | null;
}

export interface Event {
    readonly id: string;
    readonly name: string;
    readonly status: EventStatus;
    readonly lat: number;
    readonly lon: number;
    readonly rad: number;
    readonly hostId: string;
    readonly startDate: Date;
    readonly endDate?: Date | null;
    readonly media?: Media[] | null;
    readonly users?: User[] | null;
    readonly currentUsers?: User[] | null;
}

export class EventManager {
    static host(event: Event): User | undefined {
        return event.users ? event.users.find((user) => user.id == event.hostId) : undefined;
    }

    static async join(event: Event, lat: number, lon: number) {
        const token = getToken();

        // TODO: client side validation

        await request('POST', '/event/join', token, { eventId: event.id, lat, lon });
    }

    static async close(event: Event) {
        const token = getToken();

        // TODO: client side validation

        await request('POST', '/event/close', token, { eventId: event.id });
    }

    static fromEventResponse(response: EventResponse): Event {
        const {
            id,
            name,
            status,
            lat,
            lon,
            hostId,
            startDate,
            endDate,
            media,
            attendees,
            currentAttendees,
        } = response;

        const users = attendees
            ? attendees.map((user) => UserManager.fromUserResponse(user))
            : null;
        const currentUsers =
            users && currentAttendees
                ? currentAttendees.map((curUser) => {
                      return users.find((user) => user.id == curUser.id)!;
                  })
                : null;

        return {
            id,
            name,
            status,
            lat,
            lon,
            rad: 5,
            hostId,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : undefined,
            media: media ? media.map((med) => MediaManager.fromMediaResponse(med)) : undefined,
            users,
            currentUsers,
        };
    }

    static async fromId(id: string) {
        const token = getToken();
        const data = await request('GET', '/event/info', token, { eventId: id });
        return this.fromEventResponse(data as EventResponse);
    }

    static async create({
        name,
        tags,
        lat,
        lon,
        startDate,
        endDate,
    }: {
        name: string;
        tags: string[];
        lat: number;
        lon: number;
        startDate?: Date | null;
        endDate?: Date | null;
    }) {
        const token = getToken();
        const { eventId } = await request('POST', '/event/create', token, {
            name: name,
            tags: tags,
            lat: lat,
            lon: lon,
            startDateTime: startDate ? startDate.toJSON() : null,
            endDateTime: endDate ? endDate.toJSON() : null,
        });
        return await this.fromId(eventId as string);
    }

    static async find(options: {
        statuses?: EventStatus[];
        loadUsers?: boolean;
        loadMedia?: boolean;
        lat?: number;
        lon?: number;
        maxResults?: number;
        maxRadius?: number;
    }) {
        const token = getToken();
        const data = await request('GET', '/event/find', token, options);
        const eventResponses = data.events as EventResponse[];
        return eventResponses.map((res) => this.fromEventResponse(res));
    }
}
