import { Dispatch } from 'react';
import { request } from '../util';
import createDataContext from './createDataContext';

interface State {
    token: string | null;
}

// prettier-ignore
type Action =
    | { type: 'signin', payload: { token: string } }
    | { type: 'signout' }
    | { type: 'signup', payload: { token: string } }

const authReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'signout':
            return { token: null };
        case 'signin':
            return {
                token: action.payload.token,
            };
        case 'signup':
            return {
                token: action.payload.token,
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
        // email: string;
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

export const { Context: AuthContext, Provider: AuthProvider } = createDataContext(
    authReducer,
    { signin, signup, signout },
    { token: null }
);
