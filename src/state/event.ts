import { LatLng } from 'react-native-maps';

import { Event } from '../models';
import { request } from '../util';
import { createStore } from './utils/createStore';

interface State {
    events: { [id: string]: Event };
    currentEventId: string | null;

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
    currentEventId: null,

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
