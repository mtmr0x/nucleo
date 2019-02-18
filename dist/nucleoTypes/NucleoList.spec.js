"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../index");
const chai_1 = require("chai");
require("mocha");
describe('NucleoList', () => {
    const userAccountsType = new index_1.NucleoObject({
        name: 'userAccountsType',
        fields: {
            accountType: index_1.NucleoString,
            accountNumber: index_1.NucleoNumber,
            taxIdValidator: index_1.NucleoFunction
        }
    });
    const personalInfoType = new index_1.NucleoObject({
        name: 'personalInfo',
        fields: {
            firstName: index_1.NucleoString,
            lastName: index_1.NucleoString,
            items: new index_1.NucleoList(index_1.NucleoString),
            accounts: new index_1.NucleoList(userAccountsType)
        }
    });
    const userType = new index_1.NucleoObject({
        name: 'user',
        fields: {
            personalInfo: personalInfoType,
            age: index_1.NucleoNumber,
            validators: new index_1.NucleoList(index_1.NucleoFunction)
        }
    });
    const contracts = { user: userType };
    const store = index_1.createStore(contracts);
    const { dispatch, update, cloneState } = store;
    const taxIdValidator = (value) => value.length === 12;
    const newTaxIdValidator = (value) => value.length === 14;
    const accountNumberValidator = (value) => String(value).length <= 8;
    const ageValidator = (value) => value >= 18;
    it('should dispatch all data to store with empty array at accounts', () => {
        const data = {
            age: 27,
            validators: [taxIdValidator, ageValidator],
            personalInfo: {
                firstName: 'Joseph',
                lastName: 'Nor',
                items: ['a', 'b', 'c'],
                accounts: []
            }
        };
        const d = dispatch('user')(data);
        const clonedData = cloneState('user');
        const { personalInfo } = clonedData;
        chai_1.expect(d.errors.length).to.equal(0);
        chai_1.expect(personalInfo.accounts.length).to.equal(0);
        chai_1.expect(Array.isArray(personalInfo.accounts)).to.equal(true);
    });
    it('should dispatch all data to store', () => {
        const data = {
            age: 27,
            validators: [taxIdValidator, ageValidator],
            personalInfo: {
                firstName: 'Joseph',
                lastName: 'Nor',
                items: ['a', 'b', 'c'],
                accounts: [
                    { accountType: 'bank', accountNumber: 1233, taxIdValidator: taxIdValidator },
                    { accountType: 'bank', accountNumber: 9876, taxIdValidator: taxIdValidator }
                ]
            }
        };
        const d = dispatch('user')(data);
        const clonedData = cloneState('user');
        const { personalInfo } = clonedData;
        chai_1.expect(d.errors.length).to.equal(0);
    });
    it('should try to update a NucleoList of primitive values succesfully', () => {
        const u = update('user')({ personalInfo: { items: ['g', 'h', 'j', 'k'] } });
        const user = cloneState('user');
        const { personalInfo } = user;
        const { items } = personalInfo;
        chai_1.expect(personalInfo.firstName).to.equal('Joseph');
        chai_1.expect(personalInfo.lastName).to.equal('Nor');
        chai_1.expect(items.length).to.equal(4);
        chai_1.expect(personalInfo.accounts.length).to.equal(2);
        chai_1.expect(items[0]).to.equal('g');
    });
    it('should try to violate a NucleoList of primitive values with update', () => {
        const u = update('user')({ personalInfo: { items: ['g', 'h', 'j', 1] } });
        const user = cloneState('user');
        const { personalInfo } = user;
        const { items } = personalInfo;
        chai_1.expect(u.errors.length).to.equal(1);
        chai_1.expect(personalInfo.firstName).to.equal('Joseph');
        chai_1.expect(personalInfo.lastName).to.equal('Nor');
        chai_1.expect(items.length).to.equal(4);
        chai_1.expect(personalInfo.accounts.length).to.equal(2);
        chai_1.expect(items[3]).to.equal('k');
    });
    it('should try to update a NucleoList of function values succesfully', () => {
        const u = update('user')({ validators: [taxIdValidator, accountNumberValidator, ageValidator] });
        const user = cloneState('user');
        const { validators, personalInfo } = user;
        chai_1.expect(personalInfo.accounts.length).to.equal(2);
        chai_1.expect(validators[1]).to.equal(accountNumberValidator);
        chai_1.expect(validators.length).to.equal(3);
    });
    it('should try to violate a NucleoList of function values with update', () => {
        const u = update('user')({ validators: [taxIdValidator, 'string', ageValidator] });
        const user = cloneState('user');
        const { personalInfo, validators } = user;
        chai_1.expect(u.errors.length).to.equal(1);
        chai_1.expect(personalInfo.accounts.length).to.equal(2);
        chai_1.expect(validators[1]).to.equal(accountNumberValidator);
        chai_1.expect(validators.length).to.equal(3);
    });
    it('should try to update a NucleoList of object values succesfully', () => {
        const obj = {
            personalInfo: {
                accounts: [
                    { accountType: 'service', accountNumber: 1111, taxIdValidator: newTaxIdValidator },
                    { accountType: 'service', accountNumber: 2222, taxIdValidator: newTaxIdValidator }
                ]
            }
        };
        const u = update('user')(obj);
        const user = cloneState('user');
        const { personalInfo } = user;
        chai_1.expect(u.errors.length).to.equal(0);
        chai_1.expect(personalInfo.accounts[0].accountType).to.equal('service');
        chai_1.expect(personalInfo.accounts[1].accountType).to.equal('service');
        chai_1.expect(personalInfo.accounts[0].accountNumber).to.equal(1111);
        chai_1.expect(personalInfo.accounts[1].accountNumber).to.equal(2222);
        chai_1.expect(personalInfo.accounts[0].taxIdValidator).to.equal(newTaxIdValidator);
        chai_1.expect(personalInfo.accounts[1].taxIdValidator).to.equal(newTaxIdValidator);
    });
    it('should try to violate a NucleoList of object values with update', () => {
        const obj = {
            personalInfo: {
                accounts: [
                    { accountType: 'service' },
                    { accountType: 'service', accountNumber: '2222' }
                ]
            }
        };
        const u = update('user')(obj);
        const user = cloneState('user');
        const { personalInfo } = user;
        chai_1.expect(u.errors.length).to.equal(2);
        chai_1.expect(personalInfo.accounts[0].accountType).to.equal('service');
        chai_1.expect(personalInfo.accounts[1].accountType).to.equal('service');
        chai_1.expect(personalInfo.accounts[0].accountNumber).to.equal(1111);
        chai_1.expect(personalInfo.accounts[1].accountNumber).to.equal(2222);
        chai_1.expect(personalInfo.accounts[0].taxIdValidator).to.equal(newTaxIdValidator);
        chai_1.expect(personalInfo.accounts[1].taxIdValidator).to.equal(newTaxIdValidator);
    });
    it('should be able to save empty list to NucleoList', () => {
        const obj = {
            personalInfo: {
                accounts: []
            }
        };
        const u = update('user')(obj);
        const user = cloneState('user');
        const { personalInfo } = user;
        chai_1.expect(u.errors.length).to.equal(0);
        chai_1.expect(personalInfo.accounts.length).to.equal(0);
    });
});
//# sourceMappingURL=NucleoList.spec.js.map