export enum TypeKeys {
  INC = 'INC',
  DEC = 'DEC',
  OTHER_ACTION = '__any_other_action_type__'
}

export interface IIncrementAction {
  type : TypeKeys.INC;
  by : number;
}

export interface IDecrementAction {
  type : TypeKeys.DEC;
  by : number;
}

export type ActionTypes =
  | IIncrementAction
  | IDecrementAction
  | IOtherAction;

export interface IOtherAction {
  type : TypeKeys.OTHER_ACTION;
}

type State = {
  counter : number;
};

function counterReducer(s : State, action : ActionTypes) {
  switch (action.type) {
    case TypeKeys.INC:
      return { counter: s.counter + action.by };
    case TypeKeys.DEC:
      return { counter: s.counter - action.by };
    default:
      return s;
  }
}

const incrementCounter = (by : number) : IIncrementAction => ({
  type: TypeKeys.INC,
  by
});