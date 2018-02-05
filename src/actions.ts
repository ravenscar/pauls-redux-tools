import { AnyAction } from 'redux';
import { autoCreatorFactory, autoGuardFactory } from './actionTools';

enum ActionTypes {
  INC = 'INC',
  DEC = 'DEC',
  OTHER_ACTION = 'OTHER_ACTION'
}

type ActionData = {
  [ActionTypes.INC] : { by : number};
  [ActionTypes.DEC] : { by : number};
  [ActionTypes.OTHER_ACTION] : { };
};

export const actionCreators = autoCreatorFactory(ActionTypes)<ActionData>();
export const actionGuards = autoGuardFactory(ActionTypes)<ActionData>();
export type AnyAction = AnyAction;