import {
  createStore,
  NucleoNumberAssertion,
  NucleoString,
  NucleoObject,
  NucleoList,
} from './../index'

import { expect } from 'chai';
import 'mocha';

describe('NucleoNumberAssertion', () => {
  function ageValidation(value:number) {
    return value < 100;
  }

  const userType = new NucleoObject({
    name: 'user',
    fields:  {
      name: NucleoString,
      age: new NucleoNumberAssertion(ageValidation)
    }
  });

  const contracts = { document: userType };
  const store = createStore(contracts);
  const { dispatch, update, getStore } = store;

  it('should ty to violate contract with wrong type dispatching to contract', () => {
    const d = dispatch('user')({
      name: 'John',
      age: 110
    });

    expect(d.errors.length).to.equal(1);
  });

  it('should dispatch and create this item in store', () => {
    const d = dispatch('user')({
      name: 'John',
      age: 27
    });
    const { user } = getStore();

    expect(user.name).to.equal('John');
    expect(user.age).to.equal(27);
  });

  it('should try to violate contract by trying to update it', () => {
    const u = update('user')({ age: 200 });

    expect(u.errors.length).to.equal(1);
  });

  it('should update data according to contract and save it in store', () => {
    const u = update('user')({ age: 34 });
    const { user } = getStore();

    expect(user.age).to.equal(34);
    expect(user.name).to.equal('John');
  })
});
