"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./store");
const primitive_1 = require("./types/primitive");
const NucleoObjectType_1 = require("./types/NucleoObjectType");
const chai_1 = require("chai");
require("mocha");
const completeNameType = new NucleoObjectType_1.default({
    name: 'completeName',
    fields: {
        firstName: primitive_1.NucleoString,
        lastName: primitive_1.NucleoString
    }
});
const userTestType = new NucleoObjectType_1.default({
    name: 'userTest',
    fields: {
        name: completeNameType,
        age: primitive_1.NucleoNumber
    }
});
const productsTestType = new NucleoObjectType_1.default({
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
    const { dispatch, getStore } = newStore;
    it('should dispatch values to store', () => {
        dispatch('userTest')({ name: { firstName: 'John', lastName: 'Doe' } });
        const { userTest } = getStore();
        chai_1.expect(userTest.name.firstName).to.equal('John Doe');
    });
});
//# sourceMappingURL=store.spec.js.map