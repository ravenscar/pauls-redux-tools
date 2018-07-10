export { Action } from 'redux';
import { Action, Dispatch } from 'redux';

export type TAction<T extends (string | number | symbol), D extends { } = { }> = {
  type : T,
  data : D,
};

export type TGenericThunk<RS> = (dispatch : Dispatch<RS>, getState : () => RS) => void;

export type TActionShapes = Record<string, {}>;

export type TAllActionsMap<S extends TActionShapes> = {
  [P in keyof S] : TAction<P, S[P]>;
};

export type SubActionsMap<S extends TActionShapes, T extends keyof S> = Pick<TAllActionsMap<S>, T>;

export type PickActions<S extends TActionShapes, T extends keyof S> = SubActionsMap<S, T>[keyof SubActionsMap<S, T>];

// used so we can use concrete pojo/enum/object as the action types seed.
export type TActionTypes<X extends TActionShapes> = Record<keyof X, any>;

export const autoCreatorFactory = <S extends TActionShapes = never>(actionTypes : TActionTypes<S>) => {
  const creators = {} as { [T in keyof S] : (data : S[T]) => TAction<T, S[T]> };

  for (const type in actionTypes) {
    creators[type] = (data) => ({ type, data });
  }

  return creators;
};

export const autoGuardFactory = <S extends TActionShapes = never>(actionTypes : TActionTypes<S>) => {
  const guards = {} as { [T in keyof S] : (action : Action) => action is TAction<T, S[T]> };


  // Extract<keyof AT, string>
  for (const type in actionTypes) {
    guards[type] = (action) : action is TAction<typeof type, S[typeof type]> => action.type === type;
  }

  return guards;
};

export const multiTypeFilterFactory = <S extends TActionShapes = never>() => <K extends keyof S>(...wantedTypes : K[]) => (action : TAllActionsMap<TActionShapes>[keyof TAllActionsMap<TActionShapes>] | Action) : action is PickActions<S, K> => {
  if (action && action.type) {
    for (const at of wantedTypes) {
      if (action.type === at) {
        return true;
      }
    }
  }

  return false;
};
