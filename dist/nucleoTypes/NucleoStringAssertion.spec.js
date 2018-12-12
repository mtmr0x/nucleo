"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../index");
const chai_1 = require("chai");
require("mocha");
describe('NucleoStringAssertion', () => {
    function taxIdValidation(value) {
        return value.length === 11;
    }
    const userType = new index_1.NucleoObject({
        name: 'user',
        fields: {
            name: index_1.NucleoString,
            taxId: new index_1.NucleoStringAssertion(taxIdValidation)
        }
    });
    const contracts = { document: userType };
    const store = index_1.createStore(contracts);
    const { dispatch, update, cloneState } = store;
    it('should try to violate contract with wrong type dispatching to contract', () => {
        const d = dispatch('user')({
            name: 'John',
            taxId: '123456789090'
        });
        chai_1.expect(d.errors.length).to.equal(1);
    });
    it('should dispatch and create this item in store', () => {
        const d = dispatch('user')({
            name: 'John',
            taxId: '12345678909'
        });
        const user = cloneState('user');
        chai_1.expect(user.name).to.equal('John');
        chai_1.expect(user.taxId).to.equal('12345678909');
    });
    it('should try to violate contract by trying to update it', () => {
        const u = update('user')({ taxId: '0123345678909' });
        chai_1.expect(u.errors.length).to.equal(1);
    });
    it('should update data according to contract and save it in store', () => {
        const u = update('user')({ taxId: '12334567890' });
        const user = cloneState('user');
        chai_1.expect(user.taxId).to.equal('12334567890');
        chai_1.expect(user.name).to.equal('John');
    });
});
//# sourceMappingURL=NucleoStringAssertion.spec.js.map