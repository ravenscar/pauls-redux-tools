import { autoReducerFactory } from '../reducerTools';
import { autoCreatorFactory } from '../actionTools';

enum ActionTypes {
  Foo,
  Bar,
  Baz,
}

type TActionDataShape = {
  Foo : { id : string };
  Bar : { id : number };
  Baz : { first : boolean, second : number, third : string };
};

const autoCreators = autoCreatorFactory(ActionTypes)<TActionDataShape>();
const autoReducers = autoReducerFactory(ActionTypes)<TActionDataShape>();

test('autoreducer will init state in action mode', () => {
  let state : typeof autoReducers.Bar.actionDataType;
  const reducer = autoReducers.Bar.makeActionReducer({ 'id' : 123 });

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual({ 'id' : 123 });
});

test('autoreducer processes relevant actions in action mode', () => {
  let state : typeof autoReducers.Bar.actionDataType;
  const reducer = autoReducers.Bar.makeActionReducer({ id : 123 });

  state = reducer(undefined, { type : '' });

  expect(state).toEqual({ id : 123 });
  state = reducer(state, autoCreators.Bar({id : 1213}));
  expect(state).toEqual({ id : 1213 });
});

test('autoreducer ignores irrelevant actions in action mode', () => {
  let state : typeof autoReducers.Bar.actionDataType;
  const reducer = autoReducers.Bar.makeActionReducer({ id : 123 });

  state = reducer(undefined, { type : '' });

  expect(state).toEqual({ id : 123 });
  state = reducer(state, autoCreators.Foo({id : '1213'}));
  expect(state).toEqual({ id : 123 });
});

test('autoreducer will init state in property mode', () => {
  let state : typeof autoReducers.Bar.actionDataType.id;
  const reducer = autoReducers.Bar.makePropertyReducer('id', 123);

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(123);
});

test('autoreducer processes relevant actions in action mode', () => {
  let state : typeof autoReducers.Bar.actionDataType.id;
  const reducer = autoReducers.Bar.makePropertyReducer('id', 123);

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(123);
  state = reducer(state, autoCreators.Bar({id : 1213}));
  expect(state).toEqual(1213);
});

test('autoreducer ignores irrelevant actions in action mode', () => {
  let state : typeof autoReducers.Bar.actionDataType.id;
  const reducer = autoReducers.Bar.makePropertyReducer('id', 123);

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(123);
  state = reducer(state, autoCreators.Foo({id : '1213'}));
  expect(state).toEqual(123);
});