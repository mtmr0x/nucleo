import { getStore, createState, createStore } from './store';
import { expect } from 'chai';
import 'mocha';

describe('createState function', () => {
  it('should create store properly', () => {
    const initialState: any = {
      alpha: { name: 'Alpha' }
    };

    const store = createStore(initialState);

    expect(JSON.stringify(initialState)).to.equal(JSON.stringify(store.getStore()));
  });

  it('should fails trying to create a new store', () => {
    const initialState: any = {
      alpha: { name: 'Alpha' }
    };
    const store = () => createStore(initialState);

    expect(store).to.throw();
  });

  it('should create and persist state', () => {
    const model: any = {
      alpha: 'Alpha',
      delta: 'Delta'
    };

    const store = getStore();
    console.log('store', store);
    const comparable = Object.assign(store, { example: model });
    console.log('aqui', comparable);

    createState('example', model);
    const state = getStore();

    console.log('aqui 2', state);
    expect(JSON.stringify({ example: model })).to.equal(JSON.stringify(state));
  });
});

