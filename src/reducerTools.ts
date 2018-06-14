// tslint:disable-next-line no-unused-variable (needed for generating declarations until redux 4)
import { AnyAction } from 'redux';
import { Action, combineReducers } from 'redux';
import { autoGuardFactory, TActionShapes, TActionTypes } from './actionTools';

export const autoReducerFactory = <S extends TActionShapes>(actionTypes : TActionTypes<S>) => <AD extends { [T in keyof S] : AD[T] }>() => {
  const guards = autoGuardFactory(actionTypes)<AD>();
  const reducers = {} as { [T in keyof S] : {
    actionShaped : (defaultState : AD[T]) => (state : AD[T] | undefined, action : Action) => AD[T],
    actionShapedStartNull : () => (state : AD[T] | undefined | null, action : Action) => AD[T] | null,
    partialActionShaped : (defaultState : Partial<AD[T]>) => (state : Partial<AD[T]> | undefined, action : Action) => Partial<AD[T]>,
    actionPropertyShaped : <P extends keyof AD[T]>(property : P, defaultState : AD[T][P]) => (state : AD[T][P] | undefined, action : Action) => AD[T][P],
    actionPropertyShapedStartNull : <P extends keyof AD[T]>(property : P) => (state : AD[T][P] | undefined | null, action : Action) => AD[T][P] | null,
    partialActionPropertyShaped : <P extends keyof AD[T]>(property : P, defaultState : Partial<AD[T][P]>) => (state : Partial<AD[T][P]> | undefined, action : Action) => Partial<AD[T][P]>,
    asToggle : (defaultState? : boolean ) => (state : boolean | undefined, action : Action) => boolean,
  } };

  for (const type in actionTypes) {
    reducers[type] = {
      actionShaped: (defaultState) => (state, action) => guards[type](action) ? action.data : (state !== undefined) ? state : defaultState,
      actionShapedStartNull: () => (state, action) => guards[type](action) ? action.data : (state === undefined ? null : state),
      partialActionShaped: (defaultState = {}) => (state, action) => guards[type](action) ? action.data : (state !== undefined) ? state : defaultState,
      actionPropertyShaped: (field, defaultState) => (state, action) => guards[type](action) ? action.data[field] : (state !== undefined) ? state : defaultState,
      actionPropertyShapedStartNull: (field) => (state, action) => guards[type](action) ? action.data[field] : (state === undefined ? null : state),
      partialActionPropertyShaped: (field, defaultState = {}) => (state, action) => guards[type](action) ? action.data[field] : (state !== undefined) ? state : defaultState,
      asToggle: (defaultState = false) => (state, action) => {
        const currentState = !!(state !== undefined ? state : defaultState);

        return guards[type](action) ? !currentState : currentState;
      },
    };
  }

  return reducers;
};

export type TTightReducer<S> = (state : S | undefined, action : Action) => S;
export type TReducers<S> = { [K in keyof S] : TTightReducer<S[K]> };

export type TReducerWithUndefined<State> = (state : State | undefined, action : AnyAction) => State;

// need as any as combineReducers signature is wrong
export const tightCombineReducers = <State>(reducers : TReducers<State>) : TReducerWithUndefined<State> => combineReducers<State>(reducers) as any;
