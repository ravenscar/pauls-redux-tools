// tslint:disable-next-line no-unused-variable (needed for generating declarations until redux 4)
import { AnyAction } from 'redux';
import { Action, combineReducers } from 'redux';
import { autoGuardFactory, TActionShapes, TActionTypes } from './actionTools';

export const autoReducerFactory = <S extends TActionShapes>(actionTypes : TActionTypes<S>) => {
  const guards = autoGuardFactory<S>(actionTypes);
  const reducers = {} as { [T in keyof S] : {
    actionShaped : (defaultState : S[T]) => (state : S[T] | undefined, action : Action) => S[T],
    actionShapedStartNull : () => (state : S[T] | undefined | null, action : Action) => S[T] | null,
    partialActionShaped : (defaultState : Partial<S[T]>) => (state : Partial<S[T]> | undefined, action : Action) => Partial<S[T]>,
    actionPropertyShaped : <P extends keyof S[T]>(property : P, defaultState : S[T][P]) => (state : S[T][P] | undefined, action : Action) => S[T][P],
    actionPropertyShapedStartNull : <P extends keyof S[T]>(property : P) => (state : S[T][P] | undefined | null, action : Action) => S[T][P] | null,
    partialActionPropertyShaped : <P extends keyof S[T]>(property : P, defaultState : Partial<S[T][P]>) => (state : Partial<S[T][P]> | undefined, action : Action) => Partial<S[T][P]>,
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
