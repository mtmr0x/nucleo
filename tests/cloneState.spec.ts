import { createStore } from '../src/store';
import {
  NucleoString,
  NucleoNumber,
  NucleoBoolean
} from '../src/nucleoTypes/primitive'
import NucleoObject from '../src/nucleoTypes/NucleoObject';
import NucleoList from '../src/nucleoTypes/NucleoList';
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
  const { dispatch, update, cloneState } = store;

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
    const user = cloneState('user');

    expect(errors.length).to.equal(1);
    expect(user.name.firstName).to.equal('John');
    expect(user.name.lastName).to.equal('Doe');
    expect(user.age).to.equal(27);
  });
});

describe('Clone method', () => {
  const completeNameType = new NucleoObject({
    name: 'completeName',
    fields:  {
      firstName: NucleoString,
      lastName: NucleoString
    }
  });

  const userAddressType = new NucleoObject({
    name: 'userAddressType',
    fields: {
      street: NucleoString,
      streetNumber: NucleoString,
      complement: NucleoString
    }
  });

  const userLocationType = new NucleoObject({
    name: 'userLocationType',
    fields: {
      city: NucleoString,
      address: userAddressType
    }
  });

  const userType = new NucleoObject({
    name: 'user',
    fields: {
      name: completeNameType,
      age: NucleoNumber,
      location: userLocationType
    }
  });
  const contracts = { user: userType };
  const store = createStore(contracts);
  const { dispatch, update, subscribe, cloneState } = store;

  it('should dispatch first data to store', () => {
    const d = dispatch('user')({
      name: { firstName: 'John', lastName: 'Doe' },
      location: {
        city: 'NY',
        address: {
          street: '9 avenue',
          streetNumber: '678',
          complement:  ''
        }
      },
      age: 27
    });
  });
  it('should update data, then clone state to get updated data', () => {
    const { errors, data } = update('user')({ age: 18 });
    const clonedUser = cloneState('user');

    expect(clonedUser.name.firstName).to.equal('John');
    expect(clonedUser.name.lastName).to.equal('Doe');
    expect(clonedUser.age).to.equal(18);
  });
  it('should update data, clone and mutate first clone, then a new clone displays store is untouchable', () => {
    const { errors, data } = update('user')({ name: { firstName: 'Noah' } });
    const clonedUser = cloneState('user');
    clonedUser.name.firstName = 'Joseph';

    const clonedUser2 = cloneState('user');

    expect(clonedUser2.name.firstName).to.equal('Noah');
    expect(clonedUser2.name.lastName).to.equal('Doe');
    expect(clonedUser2.age).to.equal(18);
  });
  it('should try to clone a state that does not exist and receiv a undefined as response', () => {
    const state = cloneState('nonExistingState');

    expect(state).to.equal(undefined);
  })
});

