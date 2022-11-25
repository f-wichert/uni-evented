import { Dispatch } from 'react';
import createDataContext from './createDataContext';

interface State {
    eventActive: boolean;
}

// prettier-ignore
type Action =
    | { type: 'createEvent' }
    | { type: 'closeEvent' };

const eventReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'createEvent':
            return { eventActive: true };
        case 'closeEvent':
            return { eventActive: false };
        default:
            return state;
    }
};

const createEvent = (dispatch: Dispatch<Action>) => {
    return () => {
        dispatch({ type: 'createEvent' });
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
    { eventActive: false }
);
