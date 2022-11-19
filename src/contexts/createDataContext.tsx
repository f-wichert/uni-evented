import { createContext, ReactNode, useReducer } from 'react';

export default (reducer: any, action: any, defaultValue: any) => {
  const Context = createContext();

  const Provider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    const boundActions = {};

    for (const key in action) {
      boundActions[key] = action[key](dispatch);
    }

    return <Context.Provider value={{ state, ...boundActions }}>{children}</Context.Provider>;
  };

  return { Context: Context, Provider: Provider };
};
