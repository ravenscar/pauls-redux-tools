import { autoReducerFactory } from '../reducerTools';
import { autoCreatorFactory } from '../actionTools';

enum ActionTypes {
  Foo,
  Bar,
  Baz,
  Tog,
}

type TActionDataShape = {
  Foo : { id : string };
  Bar : { id : number };
  Baz : { first : boolean, second : number, third : string };
  Tog : { [index : string] : never};
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

test('autoreducer will init state in partial action mode', () => {
  let state : Partial<typeof autoReducers.Bar.actionDataType>;
  const reducer = autoReducers.Bar.makeActionPartialReducer({});

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual({ });
});

test('autoreducer processes relevant actions in partial action mode', () => {
  let state : Partial<typeof autoReducers.Bar.actionDataType>;
  const reducer = autoReducers.Bar.makeActionPartialReducer({});

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual({ });
  state = reducer(state, autoCreators.Bar({id : 1213}));
  expect(state).toEqual({ id : 1213 });
});

test('autoreducer ignores irrelevant actions in partial action mode', () => {
  let state : Partial<typeof autoReducers.Bar.actionDataType>;
  const reducer = autoReducers.Bar.makeActionPartialReducer({});

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual({ });
  state = reducer(state, autoCreators.Foo({id : '1213'}));
  expect(state).toEqual({ });
});

test('autoreducer will init state in property mode', () => {
  let state : typeof autoReducers.Bar.actionDataType.id;
  const reducer = autoReducers.Bar.makePropertyReducer('id', 123);

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(123);
});

test('autoreducer processes relevant actions in property mode', () => {
  let state : typeof autoReducers.Bar.actionDataType.id;
  const reducer = autoReducers.Bar.makePropertyReducer('id', 123);

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(123);
  state = reducer(state, autoCreators.Bar({id : 1213}));
  expect(state).toEqual(1213);
});

test('autoreducer ignores irrelevant actions in property mode', () => {
  let state : typeof autoReducers.Bar.actionDataType.id;
  const reducer = autoReducers.Bar.makePropertyReducer('id', 123);

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(123);
  state = reducer(state, autoCreators.Foo({id : '1213'}));
  expect(state).toEqual(123);
});

test('autoreducer will init undefined state in optional property mode', () => {
  let state : typeof autoReducers.Bar.actionDataType.id | undefined;
  const reducer = autoReducers.Bar.makeOptionalPropertyReducer('id');

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toBeUndefined();
});

test('autoreducer processes relevant actions in optional property mode', () => {
  let state : typeof autoReducers.Bar.actionDataType.id | undefined;
  const reducer = autoReducers.Bar.makeOptionalPropertyReducer('id');

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toBeUndefined();
  state = reducer(state, autoCreators.Bar({id : 1213}));
  expect(state).toEqual(1213);
});

test('autoreducer ignores irrelevant actions in optional property mode', () => {
  let state : typeof autoReducers.Bar.actionDataType.id | undefined;
  const reducer = autoReducers.Bar.makeOptionalPropertyReducer('id');

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toBeUndefined();
  state = reducer(state, autoCreators.Foo({id : '1213'}));
  expect(state).toBeUndefined();
});

test('autoreducer will init false state in toggle mode without default', () => {
  let state : boolean;
  const reducer = autoReducers.Tog.makeToggleReducer();

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(false);
});

test('autoreducer can init to true state in toggle mode with default', () => {
  let state : boolean;
  const reducer = autoReducers.Tog.makeToggleReducer(true);

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(true);
});

test('autoreducer processes relevant actions in toggle mode', () => {
  let state : boolean;
  const reducer = autoReducers.Tog.makeToggleReducer();

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(false);
  state = reducer(state, autoCreators.Tog({}));
  expect(state).toEqual(true);
  state = reducer(state, autoCreators.Tog({}));
  expect(state).toEqual(false);
  state = reducer(state, autoCreators.Tog({}));
  expect(state).toEqual(true);
  state = reducer(state, autoCreators.Tog({}));
  expect(state).toEqual(false);
});

test('autoreducer ignores irrelevant actions in toggle mode', () => {
  let state : boolean;
  const reducer = autoReducers.Tog.makeToggleReducer();

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(false);
  state = reducer(state, autoCreators.Bar({ id : 123 }));
  expect(state).toEqual(false);
  state = reducer(state, autoCreators.Bar({ id : 123 }));
  expect(state).toEqual(false);
});

