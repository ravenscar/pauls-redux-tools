// tslint:disable-next-line no-unused-variable (needed for generating declarations until redux 4)
import { AnyAction } from 'redux';
import { Action, combineReducers } from 'redux';
import { autoGuardFactory } from './actionTools';

export const autoReducerFactory = <AT>(actionTypes : AT) => <AD extends { [T in keyof AT] : AD[T] }>() => {
  const guards = autoGuardFactory(actionTypes)<AD>();
  const reducers = {} as { [T in keyof AT] : {
    actionDataType : AD[T],
    makeActionReducer : (defaultState : AD[T]) => (state : AD[T] | undefined, action : Action) => AD[T],
    makePropertyReducer : <P extends keyof AD[T]>(property : P, defaultState : AD[T][P]) => (state : AD[T][P] | undefined, action : Action) => AD[T][P],
  } };

  for (const type in actionTypes) {
    reducers[type] = {
      actionDataType: {},
      makeActionReducer: (defaultState) => (state, action) => guards[type](action) ? action.data : state || defaultState,
      makePropertyReducer: (field, defaultState) => (state, action) => guards[type](action) ? action.data[field] : state || defaultState,
    };
  }

  return reducers;
};

export type TReducers<S> = { [K in keyof S] : (state : S[K] | undefined, action : Action) => S[K] };

// tslint:disable-next-line no-unnecessary-callback-wrapper (it's enforcing type safety)
export const tightCombineReducers = <State>(reducers : TReducers<State>) => combineReducers<State>(reducers); // not needed if using redux 4+ as TS support improved