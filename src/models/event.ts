import { LatLng } from 'react-native-maps';

import { addEventHelper, useEventStore } from '../state/event';
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

export interface RelevantEvents {
    activeEvent: Event[];
    myEvents: Event[];
    followedEvents: Event[];
    followerEvents: Event[];
}

export class EventManager {
    static host(event: Event): User | undefined {
        return event.users ? event.users.find((user) => user.id == event.hostId) : undefined;
    }

    static async join(eventId: string, lat: number, lon: number) {
        // TODO: client side validation
        await request('POST', '/event/join', { eventId, lat, lon });

        useEventStore.setState((state) => {
            // TODO: add self as attendee? alternatively, return full event from server and just overwrite local state entirely here
            state.currentEventId = eventId;
        });
    }

    static async close(eventId: string) {
        // TODO: client side validation
        await request('POST', '/event/close', { eventId });

        useEventStore.setState((state) => {
            // update status of event
            const event = state.events[eventId];
            if (event) event.status = 'completed';

            // clear currentEventId if that event was closed
            if (state.currentEventId === eventId) state.currentEventId = null;
        });
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

    static async create(params: {
        name: string;
        tags: string[];
        location: LatLng;
        startDate?: Date | null;
        endDate?: Date | null;
    }) {
        const event = (await request('POST', '/event/create', {
            name: params.name,
            tags: params.tags,
            lat: params.location.latitude,
            lon: params.location.longitude,
            startDateTime: params.startDate?.toJSON() ?? null,
            endDateTime: params.endDate?.toJSON() ?? null,
        })) as unknown as Event;

        useEventStore.setState((state) => {
            addEventHelper(state)(event);
            state.currentEventId = event.id;
        });
        return event.id;
    }
}
