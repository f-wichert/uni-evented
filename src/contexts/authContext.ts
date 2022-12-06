import { Dispatch } from 'react';
import { request } from '../util';
import createDataContext from './createDataContext';

interface State {
    token: string | null;
    eventActive: boolean;
}

// prettier-ignore
type Action =
    | { type: 'signin', payload: { token: string } }
    | { type: 'signout' }
    | { type: 'signup', payload: { token: string } }
    | { type: 'createEvent' }
    | { type: 'closeEvent' };

const authReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'signout':
            return { token: null, eventActive: state.eventActive };
        case 'signin':
            return {
                token: action.payload.token,
                eventActive: state.eventActive,
            };
        case 'signup':
            return {
                token: action.payload.token,
                eventActive: state.eventActive,
            };
        case 'createEvent':
            return { token: state.token, eventActive: true };
        case 'closeEvent':
            return { token: state.token, eventActive: false };
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
        email,
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
    return async () => {
        dispatch({ type: 'createEvent' });
    };
};

const closeEvent = (dispatch: Dispatch<Action>) => {
    return () => {
        dispatch({ type: 'closeEvent' });
    };
};

export const { Context, Provider } = createDataContext(
    authReducer,
    { signin, signup, signout, createEvent, closeEvent },
    { token: null, eventActive: false }
);
