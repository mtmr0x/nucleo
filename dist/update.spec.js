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
        chai_1.expect(errors.length).to.equal(1);
        const user = cloneState('user');
        chai_1.expect(user.name.firstName).to.equal('John');
        chai_1.expect(user.name.lastName).to.equal('Doe');
        chai_1.expect(user.age).to.equal(27);
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
            location: userLocationType,
            verified: primitive_1.NucleoBoolean
        }
    });
    const contracts = { user: userType };
    const store = store_1.createStore(contracts);
    const { dispatch, update, cloneState, subscribe } = store;
    it('should dispatch only one property in deeper levels and just this property should be updated in store', () => {
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
            age: 27,
            verified: true
        });
        const { errors, data } = update('user')({ name: { firstName: 'Joseph' } });
        const user = cloneState('user');
        chai_1.expect(user.name.firstName).to.equal('Joseph');
        chai_1.expect(user.name.lastName).to.equal('Doe');
        chai_1.expect(user.age).to.equal(27);
    });
    it('should dispatch only one property in first level and just this property should be updated in store', () => {
        const { errors, data } = update('user')({ age: 18 });
        const user = cloneState('user');
        chai_1.expect(user.name.firstName).to.equal('Joseph');
        chai_1.expect(user.name.lastName).to.equal('Doe');
        chai_1.expect(user.age).to.equal(18);
    });
    it('should dispatch a value to a deeper level and save it properly', () => {
        const d = update('user')({ location: { address: { complement: 'apartment 2' } } });
        const user = cloneState('user');
        chai_1.expect(user.name.firstName).to.equal('Joseph');
        chai_1.expect(user.name.lastName).to.equal('Doe');
        chai_1.expect(user.age).to.equal(18);
        chai_1.expect(user.location.city).to.equal('NY');
        chai_1.expect(user.location.address.street).to.equal('9 avenue');
        chai_1.expect(user.location.address.streetNumber).to.equal('678');
        chai_1.expect(user.location.address.complement).to.equal('apartment 2');
    });
    it('should update value and listener should receive data properly', () => {
        let receivedData;
        function listener(data) {
            receivedData = data;
        }
        subscribe(listener);
        const d = update('user')({ location: { address: { complement: 'apartment 3' } } });
        const user = cloneState('user');
        chai_1.expect(receivedData.data.name.firstName).to.equal('Joseph');
        chai_1.expect(receivedData.data.name.lastName).to.equal('Doe');
        chai_1.expect(receivedData.data.age).to.equal(18);
        chai_1.expect(receivedData.data.location.city).to.equal('NY');
        chai_1.expect(receivedData.data.location.address.street).to.equal('9 avenue');
        chai_1.expect(receivedData.data.location.address.streetNumber).to.equal('678');
        chai_1.expect(receivedData.data.location.address.complement).to.equal('apartment 3');
        chai_1.expect(user.name.firstName).to.equal('Joseph');
        chai_1.expect(user.name.lastName).to.equal('Doe');
        chai_1.expect(user.age).to.equal(18);
        chai_1.expect(user.location.city).to.equal('NY');
        chai_1.expect(user.location.address.street).to.equal('9 avenue');
        chai_1.expect(user.location.address.streetNumber).to.equal('678');
        chai_1.expect(user.location.address.complement).to.equal('apartment 3');
    });
    it('should update false javascript values and save it properly', () => {
        const { errors, data } = update('user')({
            age: 0,
            name: {
                lastName: ''
            },
            verified: false
        });
        const user = cloneState('user');
        chai_1.expect(user.name.lastName).to.equal('');
        chai_1.expect(user.verified).to.equal(false);
        chai_1.expect(user.age).to.equal(0);
    });
});
//# sourceMappingURL=update.spec.js.map