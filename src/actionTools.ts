export { Action } from 'redux';
import { Action, Dispatch } from 'redux';

export type TAction<T extends (string | number | symbol), D extends { } = { }> = {
  type : T,
  data : D,
};

export type TGenericThunk<RS> = (dispatch : Dispatch<RS>, getState : () => RS) => void;

export type TActionShapes = {
  [ K : string ] : { }
};

export type TAllActionsMap<S extends TActionShapes> = {
  [P in keyof S] : TAction<P, S[P]>;
};

export type SubActionsMap<S extends TActionShapes, T extends keyof S> = Pick<TAllActionsMap<S>, T>;

export type PickActions<S extends TActionShapes, T extends keyof S> = SubActionsMap<S, T>[keyof SubActionsMap<S, T>];

// used so we can use concrete pojo/enum/object as the action types seed.
export type TActionTypes<X extends TActionShapes> = {
  [ K in keyof X ] : any
};

export const autoCreatorFactory = <S extends TActionShapes>(actionTypes : TActionTypes<S>) => <AD extends { [T in keyof S] : AD[T] }>() => {
  const creators = {} as { [T in keyof S] : (data : AD[T]) => TAction<T, AD[T]> };

  for (const type in actionTypes) {
    creators[type] = (data) => ({ type, data });
  }

  return creators;
};

export const autoGuardFactory = <S extends TActionShapes>(actionTypes : TActionTypes<S>) => <AD extends { [T in keyof S] : AD[T] }>() => {
  const guards = {} as { [T in keyof S] : (action : Action) => action is TAction<T, AD[T]> };


  // Extract<keyof AT, string>
  for (const type in actionTypes) {
    guards[type] = (action) : action is TAction<typeof type, AD[typeof type]> => action.type === type;
  }

  return guards;
};

export const multiTypeFilterFactory = <S extends TActionShapes>(actionTypes : TActionTypes<S>) => (...types : (keyof S)[]) => (action : any) : action is PickActions<S, typeof actionTypes> => {
  if (action && action.type) {
    for (const at of types) {
      if (action.type === at) {
        return true;
      }
    }
  }

  return false;
};