"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./store");
const primitive_1 = require("./nucleoTypes/primitive");
const NucleoObject_1 = require("./nucleoTypes/NucleoObject");
const chai_1 = require("chai");
require("mocha");
describe('Update forbidden attempts', () => {
    const completeNameType = new NucleoObject_1.default({
        name: 'completeName',
        fields: {
            firstName: primitive_1.NucleoString,
            lastName: primitive_1.NucleoString
        }
    });
    const userType = new NucleoObject_1.default({
        name: 'user',
        fields: {
            name: completeNameType,
            age: primitive_1.NucleoNumber
        }
    });
    const contracts = { user: userType };
    const store = store_1.createStore(contracts);
    const { dispatch, update, getStore } = store;
    it('should use update method and throw for this item in store be empty', () => {
        const d = () => update('user')({ name: { firstName: 'John' } });
        chai_1.expect(d).to.throw();
    });
    it('should dispatch values and then return error tring to update fields violating the contract', () => {
        const d = dispatch('user')({
            name: { firstName: 'John', lastName: 'Doe' },
            age: 27
        });
        const { errors, data } = update('user')({ name: { name: 'matheus' } });
        chai_1.expect(errors.length).to.equal(1);
        chai_1.expect(getStore().user.name.firstName).to.equal('John');
        chai_1.expect(getStore().user.name.lastName).to.equal('Doe');
        chai_1.expect(getStore().user.age).to.equal(27);
    });
});
describe('Update method', () => {
    const completeNameType = new NucleoObject_1.default({
        name: 'completeName',
        fields: {
            firstName: primitive_1.NucleoString,
            lastName: primitive_1.NucleoString
        }
    });
    const userType = new NucleoObject_1.default({
        name: 'user',
        fields: {
            name: completeNameType,
            age: primitive_1.NucleoNumber
        }
    });
    const contracts = { user: userType };
    const store = store_1.createStore(contracts);
    const { dispatch, update, getStore } = store;
    it('should dispatch only one property in deeper levels and just this property should be updated in store', () => {
        const d = dispatch('user')({
            name: { firstName: 'John', lastName: 'Doe' },
            age: 27
        });
        const { errors, data } = update('user')({ name: { firstName: 'matheus' } });
        chai_1.expect(getStore().user.name.firstName).to.equal('matheus');
        chai_1.expect(getStore().user.name.lastName).to.equal('Doe');
        chai_1.expect(getStore().user.age).to.equal(27);
    });
    it('should dispatch only one property in first level and just this property should be updated in store', () => {
        const { errors, data } = update('user')({ age: 18 });
        chai_1.expect(getStore().user.name.firstName).to.equal('matheus');
        chai_1.expect(getStore().user.name.lastName).to.equal('Doe');
        chai_1.expect(getStore().user.age).to.equal(18);
    });
});
//# sourceMappingURL=update.spec.js.map