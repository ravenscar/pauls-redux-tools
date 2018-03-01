import { autoReducerFactory } from '../reducerTools';
import { autoCreatorFactory } from '../actionTools';

enum ActionTypes {
  Foo,
  Bar,
  Baz,
  Tog,
  Sub,
}

type TActionDataShape = {
  Foo : { id : string };
  Bar : { id : number };
  Baz : { first : boolean, second : number, third : string };
  Tog : { [index : string] : never};
  Sub : { Prop : { id : string, count : number }}
};

const autoCreators = autoCreatorFactory(ActionTypes)<TActionDataShape>();
const autoReducers = autoReducerFactory(ActionTypes)<TActionDataShape>();

test('autoreducer will init state in actionShaped mode', () => {
  let state : TActionDataShape['Bar'];
  const reducer = autoReducers.Bar.actionShaped({ 'id' : 123 });

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual({ 'id' : 123 });
});

test('autoreducer processes relevant actions in actionShaped mode', () => {
  let state : TActionDataShape['Bar'];
  const reducer = autoReducers.Bar.actionShaped({ id : 123 });

  state = reducer(undefined, { type : '' });

  expect(state).toEqual({ id : 123 });
  state = reducer(state, autoCreators.Bar({id : 1213}));
  expect(state).toEqual({ id : 1213 });
});

test('autoreducer ignores irrelevant actions in actionShaped mode', () => {
  let state : TActionDataShape['Bar'];
  const reducer = autoReducers.Bar.actionShaped({ id : 123 });

  state = reducer(undefined, { type : '' });

  expect(state).toEqual({ id : 123 });
  state = reducer(state, autoCreators.Foo({id : '1213'}));
  expect(state).toEqual({ id : 123 });
});

test('autoreducer will init state in actionShapedStartUndefined mode', () => {
  let state : TActionDataShape['Bar'] | null;
  const reducer = autoReducers.Bar.actionShapedStartNull();

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toBeNull();
});

test('autoreducer processes relevant actions in actionShapedStartUndefined mode', () => {
  let state : TActionDataShape['Bar'] | null;
  const reducer = autoReducers.Bar.actionShapedStartNull();

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toBeNull();
  state = reducer(state, autoCreators.Bar({id : 1213}));
  expect(state).toEqual({ id : 1213 });
});

test('autoreducer ignores irrelevant actions in actionShapedStartUndefined mode', () => {
  let state : TActionDataShape['Bar'] | null;
  const reducer = autoReducers.Bar.actionShapedStartNull();

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toBeNull();
  state = reducer(state, autoCreators.Foo({id : '1213'}));
  expect(state).toBeNull();
});

test('autoreducer will init state in partialActionShaped mode', () => {
  let state : Partial<TActionDataShape['Bar']>;
  const reducer = autoReducers.Bar.partialActionShaped({});

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual({ });
});

test('autoreducer processes relevant actions in partialActionShaped mode', () => {
  let state : Partial<TActionDataShape['Bar']>;
  const reducer = autoReducers.Bar.partialActionShaped({});

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual({ });
  state = reducer(state, autoCreators.Bar({id : 1213}));
  expect(state).toEqual({ id : 1213 });
});

test('autoreducer ignores irrelevant actions in partialActionShaped mode', () => {
  let state : Partial<TActionDataShape['Bar']>;
  const reducer = autoReducers.Bar.partialActionShaped({});

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual({ });
  state = reducer(state, autoCreators.Foo({id : '1213'}));
  expect(state).toEqual({ });
});

test('autoreducer will init state in actionPropertyShaped mode', () => {
  let state : TActionDataShape['Bar']['id'];
  const reducer = autoReducers.Bar.actionPropertyShaped('id', 123);

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(123);
});

test('autoreducer processes relevant actions in actionPropertyShaped mode', () => {
  let state : TActionDataShape['Bar']['id'];
  const reducer = autoReducers.Bar.actionPropertyShaped('id', 123);

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(123);
  state = reducer(state, autoCreators.Bar({id : 1213}));
  expect(state).toEqual(1213);
});

test('autoreducer ignores irrelevant actions in actionPropertyShaped mode', () => {
  let state : TActionDataShape['Bar']['id'];
  const reducer = autoReducers.Bar.actionPropertyShaped('id', 123);

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(123);
  state = reducer(state, autoCreators.Foo({id : '1213'}));
  expect(state).toEqual(123);
});

test('autoreducer will init state in partialActionPropertyShaped mode', () => {
  let state : Partial<TActionDataShape['Sub']['Prop']>;
  const reducer = autoReducers.Sub.partialActionPropertyShaped('Prop', { count: 3 });

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual({ count: 3 });
});

test('autoreducer processes relevant actions in partialActionPropertyShaped mode', () => {
  let state : Partial<TActionDataShape['Sub']['Prop']>;
  const reducer = autoReducers.Sub.partialActionPropertyShaped('Prop', { count: 3 });

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual({ count: 3 });
  state = reducer(state, autoCreators.Sub( { Prop : { id : '2', count : 12 } }));
  expect(state).toEqual({ id : '2', count : 12 });
});

test('autoreducer ignores irrelevant actions in partialActionPropertyShaped mode', () => {
  let state : Partial<TActionDataShape['Sub']['Prop']>;
  const reducer = autoReducers.Sub.partialActionPropertyShaped('Prop', { count: 3 });

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual({ count: 3 });
  state = reducer(state, autoCreators.Bar({id : 1213}));
  expect(state).toEqual({ count: 3 });
});

test('autoreducer will init undefined state in actionPropertyShapedStartUndefined mode', () => {
  let state : TActionDataShape['Bar']['id'] | null;
  const reducer = autoReducers.Bar.actionPropertyShapedStartNull('id');

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toBeNull();
});

test('autoreducer processes relevant actions in actionPropertyShapedStartUndefined mode', () => {
  let state : TActionDataShape['Bar']['id'] | null;
  const reducer = autoReducers.Bar.actionPropertyShapedStartNull('id');

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toBeNull();
  state = reducer(state, autoCreators.Bar({id : 1213}));
  expect(state).toEqual(1213);
});

test('autoreducer ignores irrelevant actions in actionPropertyShapedStartUndefined mode', () => {
  let state : TActionDataShape['Bar']['id'] | null;
  const reducer = autoReducers.Bar.actionPropertyShapedStartNull('id');

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toBeNull();
  state = reducer(state, autoCreators.Foo({id : '1213'}));
  expect(state).toBeNull();
});

test('autoreducer will init false state in toggle mode without default', () => {
  let state : boolean;
  const reducer = autoReducers.Tog.asToggle();

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(false);
});

test('autoreducer can init to true state in toggle mode with default', () => {
  let state : boolean;
  const reducer = autoReducers.Tog.asToggle(true);

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(true);
});

test('autoreducer processes relevant actions in toggle mode', () => {
  let state : boolean;
  const reducer = autoReducers.Tog.asToggle();

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
  const reducer = autoReducers.Tog.asToggle();

  state = reducer(undefined, { type : '' }); // init state with blank action

  expect(state).toEqual(false);
  state = reducer(state, autoCreators.Bar({ id : 123 }));
  expect(state).toEqual(false);
  state = reducer(state, autoCreators.Bar({ id : 123 }));
  expect(state).toEqual(false);
});

