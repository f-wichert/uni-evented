/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext, Dispatch, ReactNode, Reducer, useReducer } from 'react';

// Thanks, stackoverflow: https://stackoverflow.com/a/66037969/5080607
// These types are mostly adapted from there, with a couple improvements
// Do not question the typescript magic, it just works™

interface ActionData {
  type: string;
  payload?: any;
}

type Action<TActionData> = (d: Dispatch<TActionData>) => (...args: any[]) => void;

type BoundActions<T, TActionData> = {
  [K in keyof T]: T[K] extends (d: Dispatch<TActionData>) => infer R ? R : never;
};
type ContextValue<TState, TActions, TActionData> = {
  state: TState;
} & BoundActions<TActions, TActionData>;

// creates a context+provider with a state and action methods
export default function createDataContext<
  TState,
  TActions extends Record<string, Action<TActionData>>,
  TActionData extends ActionData
>(reducer: Reducer<TState, TActionData>, actions: TActions, defaultValue: TState) {
  const Context = createContext({} as ContextValue<TState, TActions, TActionData>);

  const Provider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    const boundActions = Object.fromEntries(
      Object.entries(actions).map(([name, action]) => [name, action(dispatch)])
    ) as BoundActions<TActions, TActionData>;

    return <Context.Provider value={{ state, ...boundActions }}>{children}</Context.Provider>;
  };

  return { Context: Context, Provider: Provider };
}
