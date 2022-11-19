import { request } from '../util';
import createDataContext from './createDataContext';

interface State {
  token: string;
}

const authReducer = (state: State, action: any): State => {
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

const signin = (dispatch) => {
  return async ({ email, password }, token) => {
    // Do some API Request here
    console.log('Signin');

    const data = await request('POST', '/auth/login', token, {
      username: email,
      password: password,
    });
    console.log(data);

    dispatch({
      type: 'signin',
      payload: {
        token: data.token,
      },
    });
  };
};

const signout = (dispatch) => {
  return () => {
    dispatch({ type: 'signout' });
  };
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout },
  { token: null }
);
