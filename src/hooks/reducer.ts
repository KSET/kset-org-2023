import { useReducer as useReactReducer } from "react";

export const useReducer = <State, Action>(
  reducer: (prevState: State, action: Action) => State,
  initialState: State,
) => {
  return useReactReducer(reducer, initialState);
};
