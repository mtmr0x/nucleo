import {
  createStore,
  NucleoStringAssertion,
  NucleoString,
  NucleoObject,
  NucleoList,
} from '../../src/index'

import { expect } from 'chai';
import 'mocha';

describe('NucleoStringAssertion', () => {
  function taxIdValidation(value:string) {
    return value.length === 11;
  }

  const userType = new NucleoObject({
    name: 'user',
    fields:  {
      name: NucleoString,
      taxId: new NucleoStringAssertion(taxIdValidation)
    }
  });

  const contracts = { document: userType };
  const store = createStore(contracts);
  const { dispatch, update, cloneState } = store;

  it('should try to violate contract with wrong type dispatching to contract', () => {
    const d = dispatch('user')({
      name: 'John',
      taxId: '123456789090'
    });

    expect(d.errors.length).to.equal(1);
  });

  it('should dispatch and create this item in store', () => {
    const d = dispatch('user')({
      name: 'John',
      taxId: '12345678909'
    });
    const user = cloneState('user');

    expect(user.name).to.equal('John');
    expect(user.taxId).to.equal('12345678909');
  });

  it('should try to violate contract by trying to update it', () => {
    const u = update('user')({ taxId: '0123345678909' });

    expect(u.errors.length).to.equal(1);
  });

  it('should update data according to contract and save it in store', () => {
    const u = update('user')({ taxId: '12334567890' });
    const user = cloneState('user');

    expect(user.taxId).to.equal('12334567890');
    expect(user.name).to.equal('John');
  })
});

