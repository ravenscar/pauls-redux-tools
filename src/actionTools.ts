import { AnyAction } from 'redux';

export type TAction<D extends { } = { }> = {
  type : string,
  data : D,
};

export const autoCreatorFactory = <T>(types : T) => <D extends { [K in keyof T] : {} }>() => {
  const creators = {} as { [K in keyof T] : (data : D[K]) => TAction<D[K]> };

  for (const type in types) {
    if (types.hasOwnProperty(type)) {
      creators[type] = (data) => ({ type, data });
    }
  }

  return creators;
};

export const autoGuardFactory = <T>(types : T) => <D extends { [K in keyof T] : {} }>() => {
  const guards = {} as { [K in keyof T] : (action : AnyAction) => action is TAction<D[K]> };

  for (const type in types) {
    if (types.hasOwnProperty(type)) {
      guards[type] = (action) : action is TAction<{ }> => action.type === type;
    }
  }

  return guards;
};