"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../index");
const chai_1 = require("chai");
require("mocha");
describe('NucleoFunction', () => {
    function taxIdValidation(value) {
        return value.length === 11;
    }
    const userType = new index_1.NucleoObject({
        name: 'user',
        fields: {
            name: index_1.NucleoString,
            taxIdValidation: index_1.NucleoFunction
        }
    });
    const contracts = { document: userType };
    const store = index_1.createStore(contracts);
    const { dispatch, update, cloneState } = store;
    it('should try to violate contract with wrong type dispatching to contract', () => {
        const d = dispatch('user')({
            name: 'John',
            taxIdValidation: '123456789090'
        });
        chai_1.expect(d.errors.length).to.equal(1);
    });
    it('should dispatch and create this item in store', () => {
        const d = dispatch('user')({
            name: 'John',
            taxIdValidation: taxIdValidation
        });
        const user = cloneState('user');
        chai_1.expect(user.name).to.equal('John');
        chai_1.expect(user.taxIdValidation).to.equal(taxIdValidation);
    });
    it('should try to violate contract by trying to update it', () => {
        const u = update('user')({ taxIdValidation: '0123345678909' });
        chai_1.expect(u.errors.length).to.equal(1);
    });
    it('should update data according to contract and save it in store', () => {
        function newTaxIdValidation(value) {
            return value.length === 14;
        }
        const u = update('user')({ taxIdValidation: newTaxIdValidation });
        const user = cloneState('user');
        chai_1.expect(user.taxIdValidation).to.equal(newTaxIdValidation);
        chai_1.expect(user.name).to.equal('John');
    });
});
//# sourceMappingURL=NucleoFunction.spec.js.map