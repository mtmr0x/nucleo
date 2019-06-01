import {
  NucleoString,
  NucleoNumber,
  NucleoBoolean,
  NucleoList,
  NucleoObject,
  NucleoFunction,
  createStore
} from '../../src/index'
import { expect } from 'chai';
import 'mocha';

describe('NucleoList', () => {
  const userAccountsType = new NucleoObject({
    name: 'userAccountsType',
    fields: {
      accountType: NucleoString,
      accountNumber: NucleoNumber,
      taxIdValidator: NucleoFunction
    }
  });

  const personalInfoType = new NucleoObject({
    name: 'personalInfo',
    fields:  {
      firstName: NucleoString,
      lastName: NucleoString,
      items: new NucleoList(NucleoString),
      accounts: new NucleoList(userAccountsType)
    }
  });

  const userType = new NucleoObject({
    name: 'user',
    fields: {
      personalInfo: personalInfoType,
      age: NucleoNumber,
      validators: new NucleoList(NucleoFunction)
    }
  });

  const contracts = { user: userType };
  const store = createStore(contracts);
  const { dispatch, update, cloneState } = store;

  const taxIdValidator = (value:string) => value.length === 12;
  const newTaxIdValidator = (value:string) => value.length === 14;
  const accountNumberValidator = (value:number) => String(value).length <= 8;
  const ageValidator = (value:number) => value >= 18;

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
    }

    const d = dispatch('user')(data);
    const clonedData = cloneState('user');
    const { personalInfo } = clonedData;
    expect(d.errors.length).to.equal(0);
    expect(personalInfo.accounts.length).to.equal(0);
    expect(Array.isArray(personalInfo.accounts)).to.equal(true);
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
    }

    const d = dispatch('user')(data);
    const clonedData = cloneState('user');
    const { personalInfo } = clonedData;
    expect(d.errors.length).to.equal(0);
  });

  it('should try to update a NucleoList of primitive values succesfully', () => {
    const u = update('user')({ personalInfo: { items: ['g', 'h', 'j', 'k'] } });

    const user = cloneState('user');
    const { personalInfo } = user;

    const { items } = personalInfo;

    expect(personalInfo.firstName).to.equal('Joseph');
    expect(personalInfo.lastName).to.equal('Nor');
    expect(items.length).to.equal(4);
    expect(personalInfo.accounts.length).to.equal(2);
    expect(items[0]).to.equal('g');
  });

  it('should try to violate a NucleoList of primitive values with update', () => {
    const u = update('user')({ personalInfo: { items: ['g', 'h', 'j', 1] } });

    const user = cloneState('user');
    const { personalInfo } = user;
    const { items } = personalInfo;

    expect(u.errors.length).to.equal(1);
    expect(personalInfo.firstName).to.equal('Joseph');
    expect(personalInfo.lastName).to.equal('Nor');
    expect(items.length).to.equal(4);
    expect(personalInfo.accounts.length).to.equal(2);
    expect(items[3]).to.equal('k');
  });

  it('should try to update a NucleoList of function values succesfully', () => {
    const u = update('user')({ validators: [taxIdValidator, accountNumberValidator, ageValidator] });

    const user = cloneState('user');
    const { validators, personalInfo } = user;


    expect(personalInfo.accounts.length).to.equal(2);
    expect(validators[1]).to.equal(accountNumberValidator);
    expect(validators.length).to.equal(3);
  });

  it('should try to violate a NucleoList of function values with update', () => {
    const u = update('user')({ validators: [taxIdValidator, 'string', ageValidator] });

    const user = cloneState('user');
    const { personalInfo, validators } = user;

    expect(u.errors.length).to.equal(1);
    expect(personalInfo.accounts.length).to.equal(2);
    expect(validators[1]).to.equal(accountNumberValidator);
    expect(validators.length).to.equal(3);
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

    expect(u.errors.length).to.equal(0);
    expect(personalInfo.accounts[0].accountType).to.equal('service');
    expect(personalInfo.accounts[1].accountType).to.equal('service');
    expect(personalInfo.accounts[0].accountNumber).to.equal(1111);
    expect(personalInfo.accounts[1].accountNumber).to.equal(2222);
    expect(personalInfo.accounts[0].taxIdValidator).to.equal(newTaxIdValidator);
    expect(personalInfo.accounts[1].taxIdValidator).to.equal(newTaxIdValidator);
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

    expect(u.errors.length).to.equal(2);
    expect(personalInfo.accounts[0].accountType).to.equal('service');
    expect(personalInfo.accounts[1].accountType).to.equal('service');
    expect(personalInfo.accounts[0].accountNumber).to.equal(1111);
    expect(personalInfo.accounts[1].accountNumber).to.equal(2222);
    expect(personalInfo.accounts[0].taxIdValidator).to.equal(newTaxIdValidator);
    expect(personalInfo.accounts[1].taxIdValidator).to.equal(newTaxIdValidator);
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

    expect(u.errors.length).to.equal(0);
    expect(personalInfo.accounts.length).to.equal(0);
  });
});

