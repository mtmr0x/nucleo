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
            accountNumber: index_1.NucleoNumber
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
            age: index_1.NucleoNumber
        }
    });
    const contracts = { user: userType };
    const store = index_1.createStore(contracts);
    const { dispatch, update, cloneState } = store;
    it('should dispatch all data to store', () => {
        const data = {
            age: 27,
            personalInfo: {
                firstName: 'Joseph',
                lastName: 'Nor',
                items: ['a', 'b', 'c'],
                accounts: [
                    { accountType: 'bank', accountNumber: 1233 },
                    { accountType: 'bank', accountNumber: 9876 }
                ]
            }
        };
        const d = dispatch('user')(data);
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
    it('should try to update a NucleoList of object values succesfully', () => {
        const obj = {
            personalInfo: {
                accounts: [
                    { accountType: 'service', accountNumber: 1111 },
                    { accountType: 'service', accountNumber: 2222 }
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
    });
});
//# sourceMappingURL=NucleoList.spec.js.map