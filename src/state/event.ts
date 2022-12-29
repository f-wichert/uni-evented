import { LatLng } from 'react-native-maps';

import { Event } from '../models';
import { request } from '../util';
import { createStore } from './utils/createStore';

interface State {
    events: Readonly<{ [id: string]: Event }>;
    // `undefined` means the value hasn't loaded yet, it's expected to be set by `fetchCurrentUser`
    currentEventId: string | null | undefined;

    createEvent: (params: {
        name: string;
        location: LatLng;
        startDate?: Date;
        endDate?: Date;
    }) => Promise<string>;
    closeEvent: () => void;
    joinEvent: (params: { eventId: string }) => Promise<void>;
}

export const useEventStore = createStore<State>('event')((set) => ({
    events: {},
    currentEventId: undefined,

    createEvent: async (params) => {
        const data = await request('POST', '/event/create', {
            name: params.name,
            lat: params.location.latitude,
            lon: params.location.longitude,
            startDateTime: params.startDate?.toJSON() ?? null,
            endDateTime: params.endDate?.toJSON() ?? null,
        });
        const eventId = data.eventId as string;

        set((state) => {
            state.currentEventId = eventId;
        });
        return eventId;
    },
    closeEvent: () => {
        set((state) => {
            state.currentEventId = null;
        });
    },
    joinEvent: async (params) => {
        await request('post', '/event/join', {
            eventId: params.eventId,
            lon: 0,
            lat: 0,
        });

        set((state) => {
            state.currentEventId = params.eventId;
        });
    },
}));
