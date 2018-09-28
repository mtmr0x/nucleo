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

const completeNameType = new NucleoObject({
  name: 'completeName',
  fields:  {
    firstName: NucleoString,
    lastName: NucleoString
  }
});

const userTestType = new NucleoObject({
  name: 'userTest',
  fields: {
    name: completeNameType,
    age: NucleoNumber
  }
});

const productsTestType = new NucleoObject({
  name: 'productTest',
  fields: {
    available: NucleoBoolean
  }
});

const contracts = {
  userTest: userTestType,
  productsTest: productsTestType
};

describe('createStore function errors', () => {
  const newStore = createStore(contracts);
  const { dispatch } = newStore;
  it('should create store properly', () => {
    expect(newStore.hasOwnProperty('dispatch')).to.equal(true);
  });

  it('should throw at trying to dispatch an invalid contract', () => {
    const d = () => dispatch('user')({ name: 'Test' });

    expect(d).to.throw();
  });

  it('should throw at saving data to userTest not according to its contract fields', () => {
    const d = () => dispatch('userTest')({ firstName: 'Test' });

    expect(d).to.throw();
  });

  it('should throw at saving data to userTest not according to its contract types', () => {
    const d = () => dispatch('userTest')({ age: '23' });
    expect(d).to.throw();
  });

  it('should have a NucleoList of NucleoString and throw for dispatching wrong value type', () => {
    const productsType = new NucleoObject({
      name: 'products',
      fields: {
        sku: new NucleoList(NucleoString)
      }
    });
    const contracts = { products: productsType };
    const store = createStore(contracts);
    const { dispatch, getStore } = store;

    const d = () => dispatch('products')({ sku: ['a', 1] });
    expect(d).to.throw();
  });

  it('should have a NucleoList and dispatch it as a non-list and show receive and error', () => {
    const productsType = new NucleoObject({
      name: 'products',
      fields: {
        sku: new NucleoList(NucleoString)
      }
    });
    const contracts = { products: productsType };
    const store = createStore(contracts);
    const { dispatch, getStore } = store;

    const d = () => dispatch('products')({ sku: 'a' });
    expect(d).to.throw();
  });

  it('should have a NucleoList of NucleoObject and fails at dispatch it because the contract is violated', () => {
    const productType = new NucleoObject({
      name: 'product',
      fields: {
        title: NucleoString,
        sku: NucleoString
      }
    });

    const productsType = new NucleoObject({
      name: 'products',
      fields: {
        items: new NucleoList(productType)
      }
    });

    const contracts = { products: productsType };
    const store = createStore(contracts);
    const { dispatch, getStore } = store;
    const items = [
      { title: 'USB adapter', sku: '1324' },
      { title: 'USB Type-C adapter', sku: 4321 }
    ];

    const d = () => dispatch('products')({ items });

    expect(d).to.throw();
  });
});

describe('createStore function dispatch flow', () => {
  const newStore = createStore(contracts);
  const { dispatch, getStore } = newStore;
  it('should dispatch values to store', () => {
    dispatch('userTest')({ name: { firstName: 'John', lastName: 'Doe' } });

    const { userTest } = getStore();
    expect(userTest.name.firstName).to.equal('John');
  });

  it('should have a NucleoList of NucleoString and dispatch it properly', () => {
    const productsType = new NucleoObject({
      name: 'products',
      fields: {
        sku: new NucleoList(NucleoString)
      }
    });
    const contracts = { products: productsType };
    const store = createStore(contracts);
    const { dispatch, getStore } = store;

    dispatch('products')({ sku: ['a', 'b'] });

    expect(JSON.stringify(getStore().products.sku)).to.equal(JSON.stringify(['a', 'b']));
  });

  it('should have a NucleoList of NucleoObject and dispatch it properly', () => {
    const productType = new NucleoObject({
      name: 'product',
      fields: {
        title: NucleoString,
        sku: NucleoString
      }
    });

    const productsType = new NucleoObject({
      name: 'products',
      fields: {
        items: new NucleoList(productType)
      }
    });

    const contracts = { products: productsType };
    const store = createStore(contracts);
    const { dispatch, getStore } = store;
    const items = [
      { title: 'USB adapter', sku: '1324' },
      { title: 'USB Type-C adapter', sku: '4321' }
    ];

    dispatch('products')({ items });

    expect(JSON.stringify(getStore().products)).to.equal(JSON.stringify({ items }));
  });
});

