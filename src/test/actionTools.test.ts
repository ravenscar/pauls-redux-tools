import { autoCreatorFactory, autoGuardFactory, multiTypeFilterFactory } from '../actionTools';

enum ActionTypesStringEnum {
  Foo = 'Foo',
  Bar = 'Bar',
  Baz = 'Baz',
}

enum ActionTypesEnum {
  Foo,
  Bar,
  Baz,
}

const actionTypesPojo = {
  Foo : 'Foo',
  Bar : 'Bar',
  Baz : 'Baz',
};

class ActionTypesClass {
  readonly Foo = 'Foo';
  readonly Bar = 'Bar';
  readonly Baz = 'Baz';
}

type TActionDataShape = {
  Foo : { id : string };
  Bar : { id : number };
  Baz : { first : boolean, second : number, third : string };
};

const autoCreatorsStringEnum = autoCreatorFactory<TActionDataShape>(ActionTypesStringEnum);
const actionGuardsStringEnum = autoGuardFactory<TActionDataShape>(ActionTypesStringEnum);
const multiTypeFilterStringEnum = multiTypeFilterFactory<TActionDataShape>();

const autoCreatorsEnum = autoCreatorFactory<TActionDataShape>(ActionTypesEnum);
const actionGuardsEnum = autoGuardFactory<TActionDataShape>(ActionTypesEnum);
const multiTypeFilterEnum = multiTypeFilterFactory<TActionDataShape>();

const autoCreatorsPojo = autoCreatorFactory<TActionDataShape>(actionTypesPojo);
const actionGuardsPojo = autoGuardFactory<TActionDataShape>(actionTypesPojo);
const multiTypeFilterPojo = multiTypeFilterFactory<TActionDataShape>();

const autoCreatorsClass = autoCreatorFactory<TActionDataShape>(new ActionTypesClass());
const actionGuardsClass = autoGuardFactory<TActionDataShape>(new ActionTypesClass());
const multiTypeFilterClass = multiTypeFilterFactory<TActionDataShape>();

type TCreators = typeof autoCreatorsStringEnum & typeof autoCreatorsEnum & typeof autoCreatorsPojo & typeof autoCreatorsClass;
type TGuards = typeof actionGuardsStringEnum & typeof actionGuardsEnum & typeof actionGuardsPojo & typeof actionGuardsClass;

const combos : [TCreators, TGuards][] = [
  [autoCreatorsStringEnum, actionGuardsStringEnum],
  [autoCreatorsEnum, actionGuardsEnum],
  [autoCreatorsPojo, actionGuardsPojo],
  [autoCreatorsClass, actionGuardsClass] ];

const createSomeActions = (actionCreators : TCreators) => ({
  Foo : actionCreators.Foo({ id : 'abc' }),
  Bar : actionCreators.Bar({ id : 123 }),
  Baz : actionCreators.Baz({ first : true, second : 2, third : 'three' }),
});

test('Actions are created with correct type', () => {
  for (const [creator] of Object.values(combos)) {
    const { Foo, Bar, Baz } = createSomeActions(creator);

    expect(Foo.type).toBe('Foo');
    expect(Bar.type).toBe('Bar');
    expect(Baz.type).toBe('Baz');
  }
});

test('Actions are created with correct data', () => {
  for (const [creator] of Object.values(combos)) {
    const { Foo, Bar, Baz } = createSomeActions(creator);

    expect(Foo.data).toEqual({ id : 'abc' });
    expect(Bar.data).toEqual({ id : 123 });
    expect(Baz.data).toEqual({ first : true, second : 2, third : 'three' });
  }
});

test('Action guards work as expected', () => {
  for (const [creators, guards] of Object.values(combos)) {
    const { Foo, Bar, Baz } = createSomeActions(creators);

    expect(guards.Foo(Foo)).toBe(true);
    expect(guards.Bar(Foo)).toBe(false);
    expect(guards.Baz(Foo)).toBe(false);

    expect(guards.Foo(Bar)).toBe(false);
    expect(guards.Bar(Bar)).toBe(true);
    expect(guards.Baz(Bar)).toBe(false);

    expect(guards.Foo(Baz)).toBe(false);
    expect(guards.Bar(Baz)).toBe(false);
    expect(guards.Baz(Baz)).toBe(true);
  }
});

test('can override an autoCreator', () => {
  const overrides = {
    Foo : (data : TActionDataShape['Foo']) => ({ type : 'Foo' as 'Foo', data : { id : `myPrefix:${data.id}`} })
  };

  const actionCreators = { ...autoCreatorsPojo, ...overrides };

  const { Foo } = createSomeActions(actionCreators);

  expect(Foo.data).toEqual({ id : 'myPrefix:abc' });
});

test('multi filter works as expected simple case', () => {
  expect([
    { type: 'Bar' },
  ].filter(multiTypeFilterStringEnum('Foo'))).toEqual([
  ]);

  expect([
    { type: 'Foo' },
  ].filter(multiTypeFilterStringEnum('Foo'))).toEqual([
    { type: 'Foo' },
  ]);

  expect([
    { type: 'Foo' },
    { type: 'Bar' },
    { type: 'Baz' },
  ].filter(multiTypeFilterStringEnum('Foo'))).toEqual([
    { type: 'Foo' },
  ]);

  expect([
    { type: 'Foo' },
    { type: 'Bar' },
    { type: 'Baz' },
    { type: 'Foo' },
  ].filter(multiTypeFilterStringEnum('Foo'))).toEqual([
    { type: 'Foo' },
    { type: 'Foo' },
  ]);

  expect([
    { type: 'Foo' },
    { type: 'Bar' },
    { type: 'Baz' },
    { type: 'Foo' },
  ].filter(multiTypeFilterStringEnum('Foo', 'Bar'))).toEqual([
    { type: 'Foo' },
    { type: 'Bar' },
    { type: 'Foo' },
  ]);

  expect([
    { type: 'Foo' },
    { type: 'Bar' },
    { type: 'Baz' },
    { type: 'Foo' },
  ].filter(multiTypeFilterStringEnum('Foo', 'Bar', 'Bar', 'Bar', 'Baz'))).toEqual([
    { type: 'Foo' },
    { type: 'Bar' },
    { type: 'Baz' },
    { type: 'Foo' },
  ]);

  expect([
    { type: 'Foo' },
    { type: 'Bar' },
    { type: 'Baz' },
    { type: 'Foo' },
  ].filter(multiTypeFilterEnum('Foo', 'Bar'))).toEqual([
    { type: 'Foo' },
    { type: 'Bar' },
    { type: 'Foo' },
  ]);

  expect([
    { type: 'Foo' },
    { type: 'Bar' },
    { type: 'Baz' },
    { type: 'Foo' },
  ].filter(multiTypeFilterClass('Foo', 'Bar'))).toEqual([
    { type: 'Foo' },
    { type: 'Bar' },
    { type: 'Foo' },
  ]);

  expect([
    { type: 'Foo' },
    { type: 'Bar' },
    { type: 'Baz' },
    { type: 'Foo' },
  ].filter(multiTypeFilterPojo('Foo', 'Bar'))).toEqual([
    { type: 'Foo' },
    { type: 'Bar' },
    { type: 'Foo' },
  ]);
});