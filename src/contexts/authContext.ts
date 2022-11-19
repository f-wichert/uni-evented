import { Dispatch } from 'react';
import { request } from '../util';
import createDataContext from './createDataContext';

interface State {
  token: string | null;
}

// prettier-ignore
type Action =
  | {type: 'signin', payload: { token: string }}
  | {type: 'signout'};

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'signout':
      return { token: null };
    case 'signin':
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

const signout = (dispatch: Dispatch<Action>) => {
  return () => {
    dispatch({ type: 'signout' });
  };
};

export const { Context, Provider } = createDataContext(
  authReducer,
  { signin, signout },
  { token: null }
);
