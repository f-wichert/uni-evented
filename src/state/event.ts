import { WritableDraft } from 'immer/dist/types/types-external';
import { LatLng } from 'react-native-maps';
import shallow from 'zustand/shallow';

import { Event } from '../models';
import { notEmpty, request } from '../util';
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

/** Creates helper for adding events to state, merging new data with existing data. */
export function addEventHelper(state: WritableDraft<State>) {
    return (event: Event) => {
        state.events[event.id] = {
            // (shallow) merge old and new event data
            // TODO: this probably causes unnecessary renders if the
            //       data didn't actually change, maybe use tracked state thingy?
            ...state.events[event.id],
            ...event,
        };
    };
}

export function useEvent(id: string): Event | undefined {
    return useEventStore((state) => state.events[id]);
}

export function useEvents(ids: string[]): Event[] {
    // TODO: https://github.com/dai-shi/proxy-memoize / reselect ?
    return useEventStore((state) => ids.map((i) => state.events[i]).filter(notEmpty), shallow);
}
