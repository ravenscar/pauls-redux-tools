import { AnyAction, actionGuards } from './actions';

export type State = {
  counter : number;
};

export function reducer(s : State, action : AnyAction) {
  if (actionGuards.INC(action)) {
    return { counter: s.counter + action.data.by };
  }

  if (actionGuards.DEC(action)) {
    return { counter: s.counter - action.data.by };
  }

  return s;
}