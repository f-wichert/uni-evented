import { useCallback } from 'react';

import { addEventHelper, useEventStore } from '../state/event';
import { JSONObject } from '../types';
import { request, useAsync } from '../util';
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
        // TODO: client side validation
        await request('POST', '/event/join', { eventId: event.id, lat, lon });
    }

    static async close(event: Event) {
        // TODO: client side validation
        await request('POST', '/event/close', { eventId: event.id });
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
        const data = await request('GET', `event/info/${id}`);
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
        const { eventId } = await request('POST', '/event/create', {
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
        const data = await request('GET', '/event/find', options);
        const eventResponses = data.events as EventResponse[];
        return eventResponses.map((res) => this.fromEventResponse(res));
    }
}

interface RelevantEvents {
    activeEvent: Event[];
    myEvents: Event[];
    followedEvents: Event[];
    followerEvents: Event[];
}

export function useRelevantEvents() {
    const fetchFunc = useCallback(async () => {
        const data = (await request('GET', 'event/relevantEvents')) as unknown as RelevantEvents;

        // add event objects to store
        useEventStore.setState((state) => {
            [
                ...data.activeEvent,
                ...data.myEvents,
                ...data.followedEvents,
                ...data.followerEvents,
            ].forEach(addEventHelper(state));
        });

        // return just the IDs
        return {
            activeEvent: data.activeEvent.map((e) => e.id),
            myEvents: data.myEvents.map((e) => e.id),
            followedEvents: data.followedEvents.map((e) => e.id),
            followerEvents: data.followerEvents.map((e) => e.id),
        };
    }, []);

    return useAsync(fetchFunc);
}
