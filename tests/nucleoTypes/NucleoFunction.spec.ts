import {
  createStore,
  NucleoString,
  NucleoObject,
  NucleoList,
  NucleoFunction
} from '../../src/index'

import { expect } from 'chai';
import 'mocha';

describe('NucleoFunction', () => {
  function taxIdValidation(value:string) {
    return value.length === 11;
  }

  const userType = new NucleoObject({
    name: 'user',
    fields:  {
      name: NucleoString,
      taxIdValidation: NucleoFunction
    }
  });

  const contracts = { document: userType };
  const store = createStore(contracts);
  const { dispatch, update, cloneState } = store;

  it('should try to violate contract with wrong type dispatching to contract', () => {
    const d = dispatch('user')({
      name: 'John',
      taxIdValidation: '123456789090'
    });

    expect(d.errors.length).to.equal(1);
  });

  it('should dispatch and create this item in store', () => {
    const d = dispatch('user')({
      name: 'John',
      taxIdValidation: taxIdValidation
    });
    const user = cloneState('user');

    expect(user.name).to.equal('John');
    expect(user.taxIdValidation).to.equal(taxIdValidation);
  });

  it('should try to violate contract by trying to update it', () => {
    const u = update('user')({ taxIdValidation: '0123345678909' });

    expect(u.errors.length).to.equal(1);
  });

  it('should update data according to contract and save it in store', () => {
    function newTaxIdValidation(value:string) {
      return value.length === 14;
    }
    const u = update('user')({ taxIdValidation: newTaxIdValidation });
    const user = cloneState('user');

    expect(user.taxIdValidation).to.equal(newTaxIdValidation);
    expect(user.name).to.equal('John');
  })
});
