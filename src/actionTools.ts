export { Action } from 'redux';
import { Action, Dispatch } from 'redux';

export type TAction<D extends { } = { }> = {
  type : string,
  data : D,
};

export type TGenericThunk<RS> = (dispatch : Dispatch<RS>, getState : () => RS) => void;

export const autoCreatorFactory = <AT>(actionTypes : AT) => <AD extends { [T in keyof AT] : AD[T] }>() => {
  const creators = {} as { [T in keyof AT] : (data : AD[T]) => TAction<AD[T]> };

  for (const type in actionTypes) {
    creators[type] = (data) => ({ type, data });
  }

  return creators;
};

export const autoGuardFactory = <AT>(actionTypes : AT) => <AD extends { [T in keyof AT] : AD[T] }>() => {
  const guards = {} as { [T in keyof AT] : (action : Action) => action is TAction<AD[T]> };

  for (const type in actionTypes) {
    guards[type] = (action) : action is TAction<{ }> => action.type === type;
  }

  return guards;
};

export const multiTypeFilterFactory = <AT>(actionTypes : AT) => (...types : (keyof AT)[]) => (action : any) : boolean => {
  if (action && action.type) {
    for (const at of types) {
      if (action.type === at) {
        return true;
      }
    }
  }

  return false;
};