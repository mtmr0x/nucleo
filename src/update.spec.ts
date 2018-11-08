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
  const { dispatch, update, getStore, subscribe } = store;

  it('should dispatch only one property in deeper levels and just this property should be updated in store', () => {
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

    const { errors, data } = update('user')({ name: { firstName: 'Joseph' } });
    expect(getStore().user.name.firstName).to.equal('Joseph');
    expect(getStore().user.name.lastName).to.equal('Doe');
    expect(getStore().user.age).to.equal(27);
  });
  it('should dispatch only one property in first level and just this property should be updated in store', () => {
    const { errors, data } = update('user')({ age: 18 });

    expect(getStore().user.name.firstName).to.equal('Joseph');
    expect(getStore().user.name.lastName).to.equal('Doe');
    expect(getStore().user.age).to.equal(18);
  });

  it('should dispatch a value to a deeper level and save it properly', () => {
    const d = update('user')({ location: { address: { complement: 'apartment 2' } } });

    expect(getStore().user.name.firstName).to.equal('Joseph');
    expect(getStore().user.name.lastName).to.equal('Doe');
    expect(getStore().user.age).to.equal(18);
    expect(getStore().user.location.city).to.equal('NY');
    expect(getStore().user.location.address.street).to.equal('9 avenue');
    expect(getStore().user.location.address.streetNumber).to.equal('678');
    expect(getStore().user.location.address.complement).to.equal('apartment 2');
  });

  it('should update value and listener should receive data properly', () => {
    let receivedData:any;
    function listener(data: any) {
      receivedData = data;
    }
    subscribe(listener);
    const d = update('user')({ location: { address: { complement: 'apartment 3' } } });

    expect(receivedData.data.name.firstName).to.equal('Joseph');
    expect(receivedData.data.name.lastName).to.equal('Doe');
    expect(receivedData.data.age).to.equal(18);
    expect(receivedData.data.location.city).to.equal('NY');
    expect(receivedData.data.location.address.street).to.equal('9 avenue');
    expect(receivedData.data.location.address.streetNumber).to.equal('678');
    expect(receivedData.data.location.address.complement).to.equal('apartment 3');

    expect(getStore().user.name.firstName).to.equal('Joseph');
    expect(getStore().user.name.lastName).to.equal('Doe');
    expect(getStore().user.age).to.equal(18);
    expect(getStore().user.location.city).to.equal('NY');
    expect(getStore().user.location.address.street).to.equal('9 avenue');
    expect(getStore().user.location.address.streetNumber).to.equal('678');
    expect(getStore().user.location.address.complement).to.equal('apartment 3');
  })
});

