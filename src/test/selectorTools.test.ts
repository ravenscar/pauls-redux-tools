import { combineReducers, createStore } from 'redux';
import { autoReducerFactory, TReducerMapType } from '../reducerTools';
import { autoSelectorFactoryFactory } from '../selectorTools';
import { autoCreatorFactory } from '../actionTools';

enum ActionTypes {
  Foo,
  Bar,
  Toggle,
}

type TActionDataShape = {
  Foo : { id : string };
  Bar : { id : number };
  Toggle : { };
};

const autoCreators = autoCreatorFactory<TActionDataShape>(ActionTypes);
const autoReducers = autoReducerFactory<TActionDataShape>(ActionTypes);

const reducers = {
  fooId : autoReducers.Foo.actionPropertyShapedStartNull('id'),
  barObj : autoReducers.Bar.actionShaped({ id : 0 }),
  preferBar : autoReducers.Toggle.asToggle(),
};

type TReducerState = TReducerMapType<typeof reducers>;

const autoSelectorFactory = autoSelectorFactoryFactory<TReducerState, typeof reducers>(reducers);

test('autoSelectors works in plain mode', () => {
  const rootReducer = combineReducers(reducers);

  const autoSelectors = autoSelectorFactory( (rs : TReducerState ) => rs );

  const fooOrBar = (rs : TReducerState ) => autoSelectors.preferBar(rs) ? autoSelectors.barObj(rs).id : autoSelectors.fooId(rs);

  const selectors = { ...autoSelectors, fooOrBar };

  const store = createStore(rootReducer);

  store.dispatch(autoCreators.Foo({ id : 'the secret' }));
  expect(selectors.fooId(store.getState())).toBe('the secret');

  expect(selectors.barObj(store.getState())).toEqual({ id : 0 });
  store.dispatch(autoCreators.Bar({ id : 42 }));
  expect(selectors.barObj(store.getState())).toEqual({ id : 42 });

  expect(selectors.preferBar(store.getState())).toBe(false);
  expect(selectors.fooOrBar(store.getState())).toBe('the secret');
  store.dispatch(autoCreators.Toggle({}));
  expect(selectors.preferBar(store.getState())).toBe(true);
  expect(selectors.fooOrBar(store.getState())).toBe(42);
});

test('autoSelectors works in nested mode', () => {
  const rootReducer = combineReducers({
    someStuff : combineReducers(reducers)
  });

  const autoSelectors = autoSelectorFactory( (rs : { someStuff : TReducerState } ) => rs.someStuff );

  const fooOrBar = (rs : { someStuff : TReducerState } ) => autoSelectors.preferBar(rs) ? autoSelectors.barObj(rs).id : autoSelectors.fooId(rs);

  const selectors = { ...autoSelectors, fooOrBar };

  const store = createStore(rootReducer);

  store.dispatch(autoCreators.Foo({ id : 'the secret' }));
  expect(selectors.fooId(store.getState())).toBe('the secret');

  expect(selectors.barObj(store.getState())).toEqual({ id : 0 });
  store.dispatch(autoCreators.Bar({ id : 42 }));
  expect(selectors.barObj(store.getState())).toEqual({ id : 42 });

  expect(selectors.preferBar(store.getState())).toBe(false);
  expect(selectors.fooOrBar(store.getState())).toBe('the secret');
  store.dispatch(autoCreators.Toggle({}));
  expect(selectors.preferBar(store.getState())).toBe(true);
  expect(selectors.fooOrBar(store.getState())).toBe(42);
});
