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
    const store = getStore();

    expect(JSON.stringify(store)).to.equal('{}');
  });

  //  it('should fails trying to create a new store', () => {
  //    const store = () => createStore(models);
  //
  //    expect(store).to.throw();
  //  });
});

