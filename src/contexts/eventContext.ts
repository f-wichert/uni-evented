import { LocationObject } from 'expo-location';
import { Dispatch } from 'react';

import { request } from '../util';
import createDataContext from './createDataContext';

interface State {
    eventId: string | null;
}

// prettier-ignore
type Action =
    | { type: 'createEvent' , payload: { eventId:string } }
    | { type: 'closeEvent' };

const eventReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'createEvent':
            return { eventId: action.payload.eventId };
        case 'closeEvent':
            return { eventId: null };
        default:
            return state;
    }
};

const createEvent = (dispatch: Dispatch<Action>) => {
    return async (
        {
            name,
            location,
            startDate,
            endDate,
        }: {
            name: string;
            location: LocationObject;
            startDate?: Date;
            endDate?: Date;
        },
        token: string | null
    ) => {
        const data = await request('POST', '/event/create', token, {
            name: name,
            lat: location.coords.latitude,
            lon: location.coords.longitude,
            startDateTime: startDate ? startDate.toJSON() : null,
            endDateTime: endDate ? endDate.toJSON() : null,
        });

        dispatch({ type: 'createEvent', payload: { eventId: data.eventId as string } });
    };
};

const closeEvent = (dispatch: Dispatch<Action>) => {
    return () => {
        dispatch({ type: 'closeEvent' });
    };
};

export const { Context: EventContext, Provider: EventProvider } = createDataContext(
    eventReducer,
    { createEvent, closeEvent },
    { eventId: null }
);
