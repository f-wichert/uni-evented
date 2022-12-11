import { LocationObject } from 'expo-location';
import { Dispatch } from 'react';
import { request } from '../util';
import createDataContext from './createDataContext';

interface State {
    token: string | null;
    eventId: string | null;
}

// prettier-ignore
type Action =
    | { type: 'signin', payload: { token: string } }
    | { type: 'signout' }
    | { type: 'signup', payload: { token: string } }
    | { type: 'createEvent' , payload: { eventId:string } }
    | { type: 'closeEvent' };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'signout':
            return { token: null, eventId: state.eventId };
        case 'signin':
            return {
                token: action.payload.token,
                eventId: state.eventId,
            };
        case 'signup':
            return {
                token: action.payload.token,
                eventId: state.eventId,
            };
        default:
            return state;
    }
};

const signin = (dispatch: Dispatch<Action>) => {
    return async ({ email, password }: { email: string; password: string }) => {
        const data = await request('POST', '/auth/login', null, {
            username: email,
            password: password,
        });
        console.log(data);

        dispatch({
            type: 'signin',
            payload: {
                token: data.token as string,
            },
        });
    };
};

const signup = (dispatch: Dispatch<Action>) => {
    return async ({
        username,
        // email,
        password,
    }: {
        username: string;
        email: string;
        password: string;
    }) => {
        const data = await request('POST', '/auth/register', null, {
            username: username,
            password: password,
        });

        dispatch({
            type: 'signup',
            payload: {
                token: data.token as string,
            },
        });
    };
};

const signout = (dispatch: Dispatch<Action>) => {
    return () => {
        dispatch({ type: 'signout' });
    };
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

export const { Context: GlobalStateContext, Provider: GlobalStateProvider } = createDataContext(
    reducer,
    { signin, signup, signout, createEvent, closeEvent },
    { token: null, eventId: null }
);
