"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../index");
const chai_1 = require("chai");
require("mocha");
describe('NucleoNumberAssertion', () => {
    function ageValidation(value) {
        return value < 100;
    }
    const userType = new index_1.NucleoObject({
        name: 'user',
        fields: {
            name: index_1.NucleoString,
            age: new index_1.NucleoNumberAssertion(ageValidation)
        }
    });
    const contracts = { document: userType };
    const store = index_1.createStore(contracts);
    const { dispatch, update, cloneState } = store;
    it('should ty to violate contract with wrong type dispatching to contract', () => {
        const d = dispatch('user')({
            name: 'John',
            age: 110
        });
        chai_1.expect(d.errors.length).to.equal(1);
    });
    it('should dispatch and create this item in store', () => {
        const d = dispatch('user')({
            name: 'John',
            age: 27
        });
        const user = cloneState('user');
        chai_1.expect(user.name).to.equal('John');
        chai_1.expect(user.age).to.equal(27);
    });
    it('should try to violate contract by trying to update it', () => {
        const u = update('user')({ age: 200 });
        chai_1.expect(u.errors.length).to.equal(1);
    });
    it('should update data according to contract and save it in store', () => {
        const u = update('user')({ age: 34 });
        const user = cloneState('user');
        chai_1.expect(user.age).to.equal(34);
        chai_1.expect(user.name).to.equal('John');
    });
});
//# sourceMappingURL=NucleoNumberAssertion.spec.js.map