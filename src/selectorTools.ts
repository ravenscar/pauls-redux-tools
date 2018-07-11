/*
  The auto selector factory factory consumes a set of reducers and returns a factory which consumes a state mapping
  function, which in turn returns a map of auto generated selectors based on the input reducers.

  This is to reduce the boilerplate in writing trivial selectors.

  types:
    S : the state type relative to the reducers (e.g. does not have to be the root state of redux)
    R : the reducer map type based on S
  args:
    the reducer map for the relative state S
*/
export const autoSelectorFactoryFactory = <
  S extends { [k : string] : any },
  R extends { [k in keyof S]: (...args : any[]) => any }
>(
  reducers : R,
) => <RS>(getState : (rs : RS) => S) => {
  const selectorMap = {} as { [k in keyof S]: (state : RS) => S[k] };

  for (const selectorName in reducers) {
    selectorMap[selectorName] = (rootState : RS) => getState(rootState)[selectorName];
  }

  return selectorMap;
};
