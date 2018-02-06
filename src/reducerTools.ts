import { Action } from 'redux';
import { autoGuardFactory } from './actionTools';

export const autoReducerFactory = <AT>(actionTypes : AT) => <AD extends { [T in keyof AT] : AD[T] }>() => {
  const guards = autoGuardFactory(actionTypes)<AD>();
  const reducers = {} as { [T in keyof AT] : {
    exampleState : AD[T],
    makeActionReducer : (defaultState : AD[T]) => (state : AD[T] | undefined, action : Action) => AD[T],
    makePropertyReducer : <P extends keyof AD[T]>(property : P, defaultState : AD[T][P]) => (state : AD[T][P] | undefined, action : Action) => AD[T][P],
  } };

  for (const type in actionTypes) {
    reducers[type] = {
      exampleState: {},
      makeActionReducer: (defaultState) => (state, action) => guards[type](action) ? action.data : state || defaultState,
      makePropertyReducer: (field, defaultState) => (state, action) => guards[type](action) ? action.data[field] : state || defaultState,
    };
  }

  return reducers;
};