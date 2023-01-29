import { LatLng } from 'react-native-maps';

import { addEvents, useEventStore } from '../state/event';
import { EmptyObject } from '../types';
import { request } from '../util';
import { Media, MediaManager, MediaResponse } from './media';
import { User, UserManager, UserResponse } from './user';

export const EventStatuses = ['scheduled', 'active', 'completed'] as const;
export type EventStatus = typeof EventStatuses[number];

export interface EventResponse {
    readonly id: string;
    readonly name: string;
    readonly status: EventStatus;
    readonly lat: string;
    readonly lon: string;
    readonly rating?: number;
    readonly ratable: boolean;
    readonly startDateTime: string;
    readonly endDateTime: string | null;
    readonly address: string | null;
    readonly description: string | null;
    readonly musicStyle: string | null;
    readonly hostId: string;
    readonly media: MediaResponse[] | null;
    readonly attendees: UserResponse[] | null;
    readonly tags: Tag[];
}

export interface Event {
    readonly id: string;
    readonly name: string;
    readonly status: EventStatus;
    readonly lat: number;
    readonly lon: number;
    readonly rad: number;
    readonly rating?: number;
    readonly ratable: boolean;
    readonly startDate: Date;
    readonly endDate: Date | null;
    readonly address: string | null;
    readonly description: string | null;
    readonly musicStyle: string | null;
    readonly hostId: string;
    readonly users: User[] | null;
    readonly tags: Tag[];
}

// transient type for processed API responses by `fromEventResponse`
export interface EventExtra extends Event {
    media?: Media[];
}

export interface Tag {
    id: string;
    label: string;
    color: string;
    parent: string;
}

export interface RelevantEventsResponse {
    hostedEvents: EventResponse[];
    currentEvent: EventResponse | null;
    interestedEvents: EventResponse[];
    pastEvents: EventResponse[];
}

export type EventListKeys = {
    [K in keyof RelevantEventsResponse]: RelevantEventsResponse[K] extends EventResponse[]
        ? K
        : never;
}[keyof RelevantEventsResponse];

export type EventCreateParams = Parameters<typeof EventManager.create>[0];

export class EventManager {
    static host(event: Event): User | undefined {
        return event.users ? event.users.find((user) => user.id == event.hostId) : undefined;
    }

    static async join(eventId: string) {
        // TODO: client side validation
        await request<EmptyObject>('POST', '/event/join', { eventId });

        useEventStore.setState((state) => {
            // TODO: add self as attendee? alternatively, return full event from server and just overwrite local state entirely here
            state.currentEventId = eventId;
        });
    }

    static async leave(eventId: string) {
        // TODO: client side validation
        await request<EmptyObject>('POST', '/event/leave', { eventId });

        useEventStore.setState((state) => {
            state.currentEventId = null;
        });
    }

    static async follow(eventId: string) {
        await request<EmptyObject>('POST', '/event/follow', { eventId });
    }

    static async unfollow(eventId: string) {
        await request<EmptyObject>('POST', '/event/unfollow', { eventId });
    }

    static async start(eventId: string) {
        await request<EmptyObject>('POST', '/event/start', { eventId });

        useEventStore.setState((state) => {
            // update status of event
            const event = state.events[eventId];
            if (event) event.status = 'active';

            state.currentEventId = eventId;
        });
    }

    static async stop(eventId: string) {
        // TODO: client side validation
        await request<EmptyObject>('POST', '/event/stop', { eventId });

        useEventStore.setState((state) => {
            // update status of event
            const event = state.events[eventId];
            if (event) event.status = 'completed';

            // clear currentEventId if that event was closed
            if (state.currentEventId === eventId) state.currentEventId = null;
        });
    }

    static fromEventResponse(response: EventResponse): EventExtra {
        const { media, attendees, startDateTime, endDateTime, lat, lon, ...fields } = response;

        // TODO: add these to user store
        const users = attendees?.map((user) => UserManager.fromUserResponse(user)) ?? null;

        return {
            ...fields,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            rad: 5,
            startDate: new Date(startDateTime),
            endDate: endDateTime ? new Date(endDateTime) : null,
            users,
            media: media?.map((med) => MediaManager.fromMediaResponse(med)),
        };
    }

    static async create(params: {
        name: string;
        tags: string[]; // tag IDs
        description: string;
        location: LatLng;
        startDate: Date | null;
        endDate?: Date | null;
    }): Promise<string> {
        const event = await request<EventResponse>('POST', '/event/create', {
            name: params.name,
            tags: params.tags,
            lat: params.location.latitude,
            lon: params.location.longitude,
            description: params.description,
            startDateTime: params.startDate?.toJSON() ?? null,
            endDateTime: params.endDate?.toJSON() ?? null,
        });

        useEventStore.setState((state) => {
            addEvents(state, this.fromEventResponse(event));
            state.currentEventId = event.id;
        });
        return event.id;
    }

    static async fetchAllTags(): Promise<Tag[]> {
        return await request<Tag[]>('GET', '/info/all_tags');
    }

    static async fetchDiscoverData(
        location = { latitude: 0, longitude: 0 } as LatLng
    ): Promise<Event[]> {
        const data = await request<EventResponse[]>(
            'GET',
            `/discover/${location.latitude}-${location.longitude}`
        );
        return data.map((e) => this.fromEventResponse(e));
    }
}
