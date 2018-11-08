import {
  NucleoString,
  NucleoNumber,
  NucleoBoolean,
  NucleoList,
  NucleoObject,
  createStore
} from './../index'
import { expect } from 'chai';
import 'mocha';

describe('NucleoList', () => {
  const userAccountsType = new NucleoObject({
    name: 'userAccountsType',
    fields: {
      accountType: NucleoString,
      accountNumber: NucleoNumber
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
      age: NucleoNumber
    }
  });
  const contracts = { user: userType };
  const store = createStore(contracts);
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
    }

    const d = dispatch('user')(data);
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

    expect(u.errors.length).to.equal(0);
    expect(personalInfo.accounts[0].accountType).to.equal('service');
    expect(personalInfo.accounts[1].accountType).to.equal('service');
    expect(personalInfo.accounts[0].accountNumber).to.equal(1111);
    expect(personalInfo.accounts[1].accountNumber).to.equal(2222);
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
  });
});

