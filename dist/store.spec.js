"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./store");
const primitive_1 = require("./nucleoTypes/primitive");
const NucleoObject_1 = require("./nucleoTypes/NucleoObject");
const NucleoList_1 = require("./nucleoTypes/NucleoList");
const chai_1 = require("chai");
require("mocha");
const completeNameType = new NucleoObject_1.default({
    name: 'completeName',
    fields: {
        firstName: primitive_1.NucleoString,
        lastName: primitive_1.NucleoString
    }
});
const userTestType = new NucleoObject_1.default({
    name: 'userTest',
    fields: {
        name: completeNameType,
        age: primitive_1.NucleoNumber
    }
});
const productsTestType = new NucleoObject_1.default({
    name: 'productTest',
    fields: {
        available: primitive_1.NucleoBoolean
    }
});
const contracts = {
    userTest: userTestType,
    productsTest: productsTestType
};
describe('createStore function errors', () => {
    const newStore = store_1.createStore(contracts);
    const { dispatch } = newStore;
    it('should create store properly', () => {
        chai_1.expect(newStore.hasOwnProperty('dispatch')).to.equal(true);
    });
    it('should throw at trying to dispatch an invalid contract', () => {
        const d = () => dispatch('user')({ name: 'Test' });
        chai_1.expect(d).to.throw();
    });
    it('should throw at saving data to userTest not according to its contract fields', () => {
        const d = () => dispatch('userTest')({ firstName: 'Test' });
        chai_1.expect(d).to.throw();
    });
    it('should throw at saving data to userTest not according to its contract types', () => {
        const d = () => dispatch('userTest')({ age: '23' });
        chai_1.expect(d).to.throw();
    });
    it('should have a NucleoList of NucleoString and throw for dispatching wrong value type', () => {
        const productsType = new NucleoObject_1.default({
            name: 'products',
            fields: {
                sku: new NucleoList_1.default(primitive_1.NucleoString)
            }
        });
        const contracts = { products: productsType };
        const store = store_1.createStore(contracts);
        const { dispatch, cloneState } = store;
        const firstDispatch = dispatch('products')({ sku: ['a', 'b'] });
        const { errors, data } = dispatch('products')({ sku: ['a', 1] });
        const products = cloneState('products');
        chai_1.expect(errors.length).to.equal(1);
        chai_1.expect(JSON.stringify(products)).to.equal('{"sku":["a","b"]}');
    });
    it('should have a NucleoList and dispatch it as a non-list and show receive and error', () => {
        const productsType = new NucleoObject_1.default({
            name: 'products',
            fields: {
                sku: new NucleoList_1.default(primitive_1.NucleoString)
            }
        });
        const contracts = { products: productsType };
        const store = store_1.createStore(contracts);
        const { dispatch } = store;
        const { errors } = dispatch('products')({ sku: 'a' });
        chai_1.expect(errors.length).to.equal(1);
    });
    it('should have a NucleoList of NucleoObject and fails at dispatch it because the contract is violated', () => {
        const productType = new NucleoObject_1.default({
            name: 'product',
            fields: {
                title: primitive_1.NucleoString,
                sku: primitive_1.NucleoString
            }
        });
        const productsType = new NucleoObject_1.default({
            name: 'products',
            fields: {
                items: new NucleoList_1.default(productType)
            }
        });
        const contracts = { products: productsType };
        const store = store_1.createStore(contracts);
        const { dispatch } = store;
        const items = [
            { title: 'USB adapter', sku: '1324' },
            { title: 'USB Type-C adapter', sku: 4321 }
        ];
        const { errors } = dispatch('products')({ items });
        chai_1.expect(errors.length).to.equal(1);
    });
});
describe('createStore function dispatch flow', () => {
    const newStore = store_1.createStore(contracts);
    const { dispatch, cloneState, subscribe } = newStore;
    it('should subscribe and listeners be properly executed', () => {
        let value = [];
        function myListener(obj) {
            return value.push(obj);
        }
        subscribe(myListener);
        dispatch('userTest')({ name: { firstName: 'John', lastName: 'Doe' }, age: 27 });
        dispatch('userTest')({ name: { firstName: 'John', lastName: 'Doe' }, age: 28 });
        chai_1.expect(value.length).to.equal(2);
    });
    it('should dispatch values to store', () => {
        dispatch('userTest')({ name: { firstName: 'John', lastName: 'Doe' }, age: 29 });
        const userTest = cloneState('userTest');
        chai_1.expect(userTest.name.firstName).to.equal('John');
    });
    it('should have a NucleoList of NucleoString and dispatch it properly', () => {
        const productsType = new NucleoObject_1.default({
            name: 'products',
            fields: {
                sku: new NucleoList_1.default(primitive_1.NucleoString)
            }
        });
        const contracts = { products: productsType };
        const store = store_1.createStore(contracts);
        const { dispatch, cloneState } = store;
        dispatch('products')({ sku: ['a', 'b'] });
        const products = cloneState('products');
        chai_1.expect(JSON.stringify(products.sku)).to.equal(JSON.stringify(['a', 'b']));
    });
    it('should have a NucleoList of NucleoObject and dispatch it properly', () => {
        const productType = new NucleoObject_1.default({
            name: 'product',
            fields: {
                title: primitive_1.NucleoString,
                sku: primitive_1.NucleoString
            }
        });
        const productsType = new NucleoObject_1.default({
            name: 'products',
            fields: {
                items: new NucleoList_1.default(productType)
            }
        });
        const contracts = { products: productsType };
        const store = store_1.createStore(contracts);
        const { dispatch, cloneState } = store;
        const items = [
            { title: 'USB adapter', sku: '1324' },
            { title: 'USB Type-C adapter', sku: '4321' }
        ];
        dispatch('products')({ items });
        const products = cloneState('products');
        chai_1.expect(JSON.stringify(products)).to.equal(JSON.stringify({ items }));
    });
});
//# sourceMappingURL=store.spec.js.map