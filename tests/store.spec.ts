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
    const { dispatch, cloneState } = store;
    const firstDispatch = dispatch('products')({ sku: ['a', 'b'] });
    const { errors, data } = dispatch('products')({ sku: ['a', 1] });

    const products = cloneState('products');
    expect(errors.length).to.equal(1);
    expect(JSON.stringify(products)).to.equal('{"sku":["a","b"]}');
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
    const { dispatch } = store;
    const { errors } = dispatch('products')({ sku: 'a' });

    expect(errors.length).to.equal(1);
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
    const { dispatch } = store;
    const items = [
      { title: 'USB adapter', sku: '1324' },
      { title: 'USB Type-C adapter', sku: 4321 }
    ];

    const { errors } = dispatch('products')({ items });
    expect(errors.length).to.equal(1);
  });
});

describe('createStore function dispatch flow', () => {
  const newStore = createStore(contracts);
  const { dispatch, cloneState, subscribe } = newStore;
  it('should subscribe and listeners be properly executed', () => {
    type listenerObjectArgumentType = {
      contractName: string
    };

    let value:Array<listenerObjectArgumentType> = [];

    function myListener(obj:listenerObjectArgumentType) {
      return value.push(obj);
    }

    subscribe(myListener);

    dispatch('userTest')({ name: { firstName: 'John', lastName: 'Doe' }, age: 27 });
    dispatch('userTest')({ name: { firstName: 'John', lastName: 'Doe' }, age: 28 });

    expect(value.length).to.equal(2);
  });

  it('should dispatch values to store', () => {
    dispatch('userTest')({ name: { firstName: 'John', lastName: 'Doe' }, age: 29 });

    const userTest = cloneState('userTest');
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
    const { dispatch, cloneState } = store;

    dispatch('products')({ sku: ['a', 'b'] });
    const products = cloneState('products');

    expect(JSON.stringify(products.sku)).to.equal(JSON.stringify(['a', 'b']));
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
    const { dispatch, cloneState } = store;
    const items = [
      { title: 'USB adapter', sku: '1324' },
      { title: 'USB Type-C adapter', sku: '4321' }
    ];

    dispatch('products')({ items });
    const products = cloneState('products');

    expect(JSON.stringify(products)).to.equal(JSON.stringify({ items }));
  });
});

