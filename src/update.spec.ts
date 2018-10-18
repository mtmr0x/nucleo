import { createStore } from './store';
import {
  NucleoString,
  NucleoNumber,
  NucleoBoolean
} from './nucleoTypes/primitive'
import NucleoObject from './nucleoTypes/NucleoObject';
import NucleoList from './nucleoTypes/NucleoList';
import { expect } from 'chai';
import 'mocha';

describe('Update forbidden attempts', () => {
  const completeNameType = new NucleoObject({
    name: 'completeName',
    fields:  {
      firstName: NucleoString,
      lastName: NucleoString
    }
  });

  const userType = new NucleoObject({
    name: 'user',
    fields: {
      name: completeNameType,
      age: NucleoNumber
    }
  });
  const contracts = { user: userType };
  const store = createStore(contracts);
  const { dispatch, update, getStore } = store;

 it('should use update method and throw for this item in store be empty', () => {
   const d = () => update('user')({ name: { firstName: 'John' }});

   expect(d).to.throw();
 });

  it('should dispatch values and then return error tring to update fields violating the contract', () => {
    const d = dispatch('user')({
      name: { firstName: 'John', lastName: 'Doe' },
      age: 27
    });

    const { errors, data } = update('user')({ name: { name: 'matheus' } });
    expect(errors.length).to.equal(1);
    expect(getStore().user.name.firstName).to.equal('John');
    expect(getStore().user.name.lastName).to.equal('Doe');
    expect(getStore().user.age).to.equal(27);
  });
});

describe('Update method', () => {
  const completeNameType = new NucleoObject({
    name: 'completeName',
    fields:  {
      firstName: NucleoString,
      lastName: NucleoString
    }
  });

  const userType = new NucleoObject({
    name: 'user',
    fields: {
      name: completeNameType,
      age: NucleoNumber
    }
  });
  const contracts = { user: userType };
  const store = createStore(contracts);
  const { dispatch, update, getStore } = store;

  it('should dispatch only one property in deeper levels and just this property should be updated in store', () => {
    const d = dispatch('user')({
      name: { firstName: 'John', lastName: 'Doe' },
      age: 27
    });

    const { errors, data } = update('user')({ name: { firstName: 'matheus' } });
    expect(getStore().user.name.firstName).to.equal('matheus');
    expect(getStore().user.name.lastName).to.equal('Doe');
    expect(getStore().user.age).to.equal(27);
  });
  it('should dispatch only one property in first level and just this property should be updated in store', () => {
    const { errors, data } = update('user')({ age: 18 });

    expect(getStore().user.name.firstName).to.equal('matheus');
    expect(getStore().user.name.lastName).to.equal('Doe');
    expect(getStore().user.age).to.equal(18);
  });
});
