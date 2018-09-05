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
});
describe('createStore function dispatch flow', () => {
    const newStore = store_1.createStore(contracts);
    const { dispatch, cloneStore } = newStore;
    it('should dispatch values to store', () => {
        dispatch('userTest')({ name: { firstName: 'John', lastName: 'Doe' } });
        const { userTest } = cloneStore();
        chai_1.expect(userTest.name.firstName).to.equal('John');
    });
    it('should have a NucleoList of NucleoObject and dispatch it properly', () => {
        const contracts = new NucleoObject_1.default({
            name: 'products',
            fields: {
                sku: new NucleoList_1.default(primitive_1.NucleoString)
            }
        });
        const store = store_1.createStore({ products: {} });
    });
});
//# sourceMappingURL=store.spec.js.map