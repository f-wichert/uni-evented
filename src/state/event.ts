import { LatLng } from 'react-native-maps';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { request } from '../util';
import { getToken } from './auth';

interface State {
    eventId: string | null;
    createEvent: (params: {
        name: string;
        location: LatLng;
        startDate?: Date;
        endDate?: Date;
    }) => Promise<void>;
    closeEvent: () => void;
}

export const useEventStore = create<State>()(
    immer((set) => ({
        eventId: null,

        createEvent: async (params) => {
            const data = await request('POST', '/event/create', getToken(), {
                name: params.name,
                lat: params.location.latitude,
                lon: params.location.longitude,
                startDateTime: params.startDate?.toJSON() ?? null,
                endDateTime: params.endDate?.toJSON() ?? null,
            });
            console.debug('createEvent response:', data);

            set((state) => {
                state.eventId = data.eventId as string;
            });
        },
        closeEvent: () => {
            set((state) => {
                state.eventId = null;
            });
        },
    }))
);
