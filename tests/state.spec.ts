import { useNucleoState } from '../src/store';
import {
  NucleoString,
  NucleoNumber,
  NucleoBoolean,
  NucleoObject,
  NucleoList,
} from '../src';
import { expect } from 'chai';
import 'mocha';

describe('Update forbidden attempts', () => {
  const completeNameType = new NucleoObject({
    name: 'completeName',
    fields:  {
      firstName: NucleoString,
      lastName: NucleoString
    }
  });

  const User = new NucleoObject({
    name: 'user',
    fields: {
      name: completeNameType,
      age: NucleoNumber,
      isAuthenticated: NucleoBoolean,
      scope: new NucleoList(NucleoString),
    }
  });
  /*
   * const [getState, setState, subscribe] = createStore(contracts);
   * const [user, setUser, subscribe] = useNucleoState(userContract)
   */

  it('should use nucleo state', () => {
    const [user, setUser] = useNucleoState<any>(User) // make this any be able to receive User
    console.log('user state', user());
    const transaction = setUser({ name: { firstName: 'John' } });
    console.log('user state 2', user());
    console.log('transaction', transaction);
    console.log('make it possible', user().age); // make it possible
    const newUser = user() as any;
    expect(newUser.age).to.equal(null);
  })

  // it('should create a singular piece of user state', () => {
  //   update('user')({ name: { firstName: 'John' }});

  //   const user = cloneState('user') as any;

  //   expect(user.name.firstName).to.equal('John');
  //   expect(user.name.lastName).to.equal(null);
  // });

  // it('should dispatch another piece of store in user contract', () => {
  //   update('user')({ name: { lastName: 'Doe' }, age: 29 });
  //   const user = cloneState('user') as any;

  //   expect(user.name.firstName).to.equal('John');
  //   expect(user.name.lastName).to.equal('Doe');
  // });

//   it('should dispatch values and then return error tring to update fields violating the contract', () => {
//     const d = dispatch('user')({
//       name: { firstName: 'John', lastName: 'Doe' },
//       age: 27
//     });
//
//     const { errors, data } = update('user')({ name: { name: 'matheus' } });
//     expect(errors.length).to.equal(1);
//     const user = cloneState('user') as any;
//     expect(user.name.firstName).to.equal('John');
//     expect(user.name.lastName).to.equal('Doe');
//     expect(user.age).to.equal(27);
//   });
});

// describe('Update method', () => {
//   const completeNameType = new NucleoObject({
//     name: 'completeName',
//     fields:  {
//       firstName: NucleoString,
//       lastName: NucleoString
//     }
//   });
//
//   const userAddressType = new NucleoObject({
//     name: 'userAddressType',
//     fields: {
//       street: NucleoString,
//       streetNumber: NucleoString,
//       complement: NucleoString
//     }
//   });
//
//   const userLocationType = new NucleoObject({
//     name: 'userLocationType',
//     fields: {
//       city: NucleoString,
//       address: userAddressType
//     }
//   });
//
//   const userType = new NucleoObject({
//     name: 'user',
//     fields: {
//       name: completeNameType,
//       age: NucleoNumber,
//       location: userLocationType,
//       verified: NucleoBoolean
//     }
//   });
//   const contracts = { user: userType };
//   const store = createStore(contracts);
//   const { dispatch, update, cloneState, subscribe } = store;
//
//   it('should dispatch only one property in deeper levels and just this property should be updated in store', () => {
//     const d = dispatch('user')({
//       name: { firstName: 'John', lastName: 'Doe' },
//       location: {
//         city: 'NY',
//         address: {
//           street: '9 avenue',
//           streetNumber: '678',
//           complement:  ''
//         }
//       },
//       age: 27,
//       verified: true
//     });
//
//     update('user')({ name: { firstName: 'Joseph' } });
//     const user = cloneState('user') as any;
//     expect(user.name.firstName).to.equal('Joseph');
//     expect(user.name.lastName).to.equal('Doe');
//     expect(user.age).to.equal(27);
//   });
//   it('should dispatch only one property in first level and just this property should be updated in store', () => {
//     update('user')({ age: 18 });
//     const user = cloneState('user') as any;
//
//     expect(user.name.firstName).to.equal('Joseph');
//     expect(user.name.lastName).to.equal('Doe');
//     expect(user.age).to.equal(18);
//   });
//
//   it('should dispatch a value to a deeper level and save it properly', () => {
//     update('user')({ location: { address: { complement: 'apartment 2' } } });
//     const user = cloneState('user') as any;
//
//     expect(user.name.firstName).to.equal('Joseph');
//     expect(user.name.lastName).to.equal('Doe');
//     expect(user.age).to.equal(18);
//     expect(user.location.city).to.equal('NY');
//     expect(user.location.address.street).to.equal('9 avenue');
//     expect(user.location.address.streetNumber).to.equal('678');
//     expect(user.location.address.complement).to.equal('apartment 2');
//   });
//
//   it('should update value and listener should receive data properly', () => {
//     let receivedData:any;
//     function listener(data: any) {
//       receivedData = data;
//     }
//     subscribe(listener);
//     update('user')({ location: { address: { complement: 'apartment 3' } } });
//     const user = cloneState('user') as any;
//
//     expect(receivedData.data.name.firstName).to.equal('Joseph');
//     expect(receivedData.data.name.lastName).to.equal('Doe');
//     expect(receivedData.data.age).to.equal(18);
//     expect(receivedData.data.location.city).to.equal('NY');
//     expect(receivedData.data.location.address.street).to.equal('9 avenue');
//     expect(receivedData.data.location.address.streetNumber).to.equal('678');
//     expect(receivedData.data.location.address.complement).to.equal('apartment 3');
//
//     expect(user.name.firstName).to.equal('Joseph');
//     expect(user.name.lastName).to.equal('Doe');
//     expect(user.age).to.equal(18);
//     expect(user.location.city).to.equal('NY');
//     expect(user.location.address.street).to.equal('9 avenue');
//     expect(user.location.address.streetNumber).to.equal('678');
//     expect(user.location.address.complement).to.equal('apartment 3');
//   });
//
//   it('should update false javascript values and save it properly', () => {
//     const { errors, data } = update('user')({
//       age: 0,
//       name: {
//         lastName: ''
//       },
//       verified: false
//     });
//
//     const user = cloneState('user') as any;
//
//     expect(user.name.lastName).to.equal('');
//     expect(user.verified).to.equal(false);
//     expect(user.age).to.equal(0);
//
//   });
// });

