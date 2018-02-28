// tslint:disable-next-line no-unused-variable (needed for generating declarations until redux 4)
import { AnyAction } from 'redux';
import { Action, combineReducers } from 'redux';
import { autoGuardFactory } from './actionTools';

export const autoReducerFactory = <AT>(actionTypes : AT) => <AD extends { [T in keyof AT] : AD[T] }>() => {
  const guards = autoGuardFactory(actionTypes)<AD>();
  const reducers = {} as { [T in keyof AT] : {
    actionDataType : AD[T],
    makeActionReducer : (defaultState : AD[T]) => (state : AD[T] | undefined, action : Action) => AD[T],
    makeActionOptionalReducer : () => (state : AD[T] | undefined, action : Action) => AD[T] | undefined,
    makeActionPartialReducer : (defaultState : Partial<AD[T]>) => (state : Partial<AD[T]> | undefined, action : Action) => Partial<AD[T]>,
    makePropertyReducer : <P extends keyof AD[T]>(property : P, defaultState : AD[T][P]) => (state : AD[T][P] | undefined, action : Action) => AD[T][P],
    makeOptionalPropertyReducer : <P extends keyof AD[T]>(property : P) => (state : AD[T][P] | undefined, action : Action) => AD[T][P] | undefined,
    makeToggleReducer : (defaultState? : boolean ) => (state : boolean | undefined, action : Action) => boolean,
  } };

  for (const type in actionTypes) {
    reducers[type] = {
      actionDataType: {},
      makeActionReducer: (defaultState) => (state, action) => guards[type](action) ? action.data : (state !== undefined) ? state : defaultState,
      makeActionOptionalReducer: () => (state, action) => guards[type](action) ? action.data : state,
      makeActionPartialReducer: (defaultState) => (state, action) => guards[type](action) ? action.data : (state !== undefined) ? state : defaultState,
      makePropertyReducer: (field, defaultState) => (state, action) => guards[type](action) ? action.data[field] : (state !== undefined) ? state : defaultState,
      makeOptionalPropertyReducer: (field) => (state, action) => guards[type](action) ? action.data[field] : state,
      makeToggleReducer: (defaultState = false) => (state, action) => {
        const currentState = !!(state !== undefined ? state : defaultState);

        return guards[type](action) ? !currentState : currentState;
      },
    };
  }

  return reducers;
};

export type TTightReducer<S> = (state : S | undefined, action : Action) => S;
export type TReducers<S> = { [K in keyof S] : TTightReducer<S[K]> };

// tslint:disable-next-line no-unnecessary-callback-wrapper (it's enforcing type safety)
export const tightCombineReducers = <State>(reducers : TReducers<State>) => combineReducers<State>(reducers); // not needed if using redux 4+ as TS support improved

