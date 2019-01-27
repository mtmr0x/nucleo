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
    const { dispatch, update, cloneState } = store;
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
        const user = cloneState('user');
        chai_1.expect(errors.length).to.equal(1);
        chai_1.expect(user.name.firstName).to.equal('John');
        chai_1.expect(user.name.lastName).to.equal('Doe');
        chai_1.expect(user.age).to.equal(27);
    });
});
describe('Clone method', () => {
    const completeNameType = new NucleoObject_1.default({
        name: 'completeName',
        fields: {
            firstName: primitive_1.NucleoString,
            lastName: primitive_1.NucleoString
        }
    });
    const userAddressType = new NucleoObject_1.default({
        name: 'userAddressType',
        fields: {
            street: primitive_1.NucleoString,
            streetNumber: primitive_1.NucleoString,
            complement: primitive_1.NucleoString
        }
    });
    const userLocationType = new NucleoObject_1.default({
        name: 'userLocationType',
        fields: {
            city: primitive_1.NucleoString,
            address: userAddressType
        }
    });
    const userType = new NucleoObject_1.default({
        name: 'user',
        fields: {
            name: completeNameType,
            age: primitive_1.NucleoNumber,
            location: userLocationType
        }
    });
    const contracts = { user: userType };
    const store = store_1.createStore(contracts);
    const { dispatch, update, subscribe, cloneState } = store;
    it('should dispatch first data to store', () => {
        const d = dispatch('user')({
            name: { firstName: 'John', lastName: 'Doe' },
            location: {
                city: 'NY',
                address: {
                    street: '9 avenue',
                    streetNumber: '678',
                    complement: ''
                }
            },
            age: 27
        });
    });
    it('should update data, then clone state to get updated data', () => {
        const { errors, data } = update('user')({ age: 18 });
        const clonedUser = cloneState('user');
        chai_1.expect(clonedUser.name.firstName).to.equal('John');
        chai_1.expect(clonedUser.name.lastName).to.equal('Doe');
        chai_1.expect(clonedUser.age).to.equal(18);
    });
    it('should update data, clone and mutate first clone, then a new clone displays store is untouchable', () => {
        const { errors, data } = update('user')({ name: { firstName: 'Noah' } });
        const clonedUser = cloneState('user');
        clonedUser.name.firstName = 'Joseph';
        const clonedUser2 = cloneState('user');
        chai_1.expect(clonedUser2.name.firstName).to.equal('Noah');
        chai_1.expect(clonedUser2.name.lastName).to.equal('Doe');
        chai_1.expect(clonedUser2.age).to.equal(18);
    });
    it('should try to clone a state that does not exist and receiv a undefined as response', () => {
        const state = cloneState('nonExistingState');
        chai_1.expect(state).to.equal(undefined);
    });
});
//# sourceMappingURL=cloneState.spec.js.map