import { createStore } from './store';
import {
  NucleoString,
  NucleoNumber,
  NucleoBoolean
} from './types/primitive'
import NucleoObjectType from './types/NucleoObjectType';
import { expect } from 'chai';
import 'mocha';

const contracts = {
  userTest: new NucleoObjectType({
    name: 'userTest',
    fields: {
      name: NucleoString,
      age: NucleoNumber
    }
  }),
  productsTest: new NucleoObjectType({
    name: 'productTest',
    fields: {
      available: NucleoBoolean
    }
  })
}

describe('createStore function errors', () => {
  const newStore = createStore(contracts);
  const { dispatch } = newStore;
  it('should create store properly', () => {
    expect(newStore.hasOwnProperty('dispatch')).to.equal(true);
  });

  it('should throw at trying to dispatch an invalid contract', () => {
    const d = () => dispatch('user')({ name: 'Test' });

    expect(d).to.throw();
  });

  it('should throw at saving data to userTest not according to its contract fields', () => {
    const d = () => dispatch('userTest')({ firstName: 'Test' });

    expect(d).to.throw();
  });

  it('should throw at saving data to userTest not according to its contract types', () => {
    const d = () => dispatch('userTest')({ name: 123 });
    expect(d).to.throw();
  });
});

describe('createStore function dispatch flow', () => {
  const newStore = createStore(contracts);
  const { dispatch, getStore } = newStore;
  it('should dispatch values to store', () => {
    console.log(getStore());
    dispatch('userTest')({ name: "John Doe" });
    console.log(getStore());
    const { userTest } = getStore();
    userTest.name = 'Joaquim';
    console.log(getStore());
  })
});

