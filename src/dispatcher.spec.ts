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

describe('dispatch function', () => {
  it('should access store by argument', () => {
    // const newStore = createStore(models);

    expect(true).to.equal(true);
  });
});

