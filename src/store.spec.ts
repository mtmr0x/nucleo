import { getStore, createStore } from './store';
import {
  NucleoString,
  NucleoNumber,
  NucleoBoolean
} from './types/primitive'
import { expect } from 'chai';
import 'mocha';

const models = [
  {
    name: 'userTest',
    fields: {
      name: NucleoString,
      age: NucleoNumber
    }
  },
  {
    name: 'productTest',
    fields: {
      available: NucleoBoolean
    }
  }
];

describe('createStore function', () => {
  it('should create store properly', () => {
    const newStore = createStore(models);

    console.log('store', newStore);
    expect(newStore.hasOwnProperty('dispatch')).to.equal(true);
  });

  it('should fails trying to create a new store', () => {
    const store = () => createStore(models);

    expect(store).to.throw();
  });

  it('should destroy store', () => {

  })
});

