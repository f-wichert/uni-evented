import { useToken } from '../contexts/authContext';
import { JSONObject } from '../types';
import { request } from '../util';
import Media, { MediaResponse } from './media';
import User, { UserResponse } from './user';

export const EventStatuses = ['scheduled', 'active', 'completed'] as const;
export type EventStatus = typeof EventStatuses[number];

export interface EventResponse extends JSONObject {
    id: string;
    name: string;
    status: EventStatus;
    lat: number;
    lon: number;
    hostId: string;
    startDate: string;
    endDate: string | null;
    media: MediaResponse[] | null;
    attendees: UserResponse[] | null;
    currentAttendees: UserResponse[] | null;
}

export default class Event {
    readonly id: string;
    readonly name: string;
    readonly status: EventStatus;
    readonly lat: number;
    readonly lon: number;
    readonly rad: number;
    readonly hostId: string;
    readonly startDate: Date;
    readonly endDate: Date | null;
    readonly media: Media[] | null;
    readonly users: User[] | null;
    readonly currentUsers: User[] | null;

    constructor({
        id,
        name,
        status,
        lat,
        lon,
        rad,
        hostId,
        startDate,
        endDate,
        media,
        users,
        currentUsers,
    }: {
        id: string;
        name: string;
        status: EventStatus;
        lat: number;
        lon: number;
        rad?: number;
        hostId: string;
        startDate: Date;
        endDate?: Date | null;
        media?: Media[] | null;
        users?: User[] | null;
        currentUsers?: User[] | null;
    }) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.lat = lat;
        this.lon = lon;
        this.rad = rad || 5;
        this.hostId = hostId;
        this.startDate = startDate;
        this.endDate = endDate || null;
        this.media = media || null;
        this.users = users || null;
        this.currentUsers = currentUsers || null;
    }

    host() {
        return this.users ? this.users.find((user) => user.id == this.hostId) : null;
    }

    async join(lat: number, lon: number) {
        const token = useToken();

        // TODO: client side validation

        await request('POST', '/event/join', token, { eventId: this.id, lat, lon });
    }

    async close() {
        const token = useToken();

        // TODO: client side validation

        await request('POST', '/event/close', token, { eventId: this.id });
    }

    static fromEventResponse(response: EventResponse) {
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

        const users = attendees ? attendees.map((user) => User.fromUserResponse(user)) : null;
        const currentUsers =
            users && currentAttendees
                ? currentAttendees.map((curUser) => {
                      return users.find((user) => user.id == curUser.id)!;
                  })
                : null;

        return new Event({
            id,
            name,
            status,
            lat,
            lon,
            hostId,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            media: media ? media.map((med) => Media.fromMediaResponse(med)) : null,
            users,
            currentUsers,
        });
    }

    static async fromId(id: string) {
        const token = useToken();
        const data = await request('GET', '/event/info', token, { eventId: id });
        return Event.fromEventResponse(data as EventResponse);
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
        startDate: Date | null;
        endDate: Date | null;
    }) {
        const token = useToken();
        const { eventId } = await request('POST', '/event/create', token, {
            name: name,
            tags: tags,
            lat: lat,
            lon: lon,
            startDateTime: startDate ? startDate.toJSON() : null,
            endDateTime: endDate ? endDate.toJSON() : null,
        });
        return await Event.fromId(eventId as string);
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
        const token = useToken();
        const data = await request('GET', '/event/find', token, options);
        const eventResponses = data.events as EventResponse[];
        return eventResponses.map((res) => Event.fromEventResponse(res));
    }
}
