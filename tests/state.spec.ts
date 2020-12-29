import { nucleoState } from '../src/nucleoState';
import {
  NucleoString,
  NucleoNumber,
  NucleoBoolean,
  NucleoModel,
  NucleoList,
} from '../src';
import { expect } from 'chai';
import 'mocha';

describe('Update forbidden attempts', () => {
  const completeNameType = new NucleoModel({
    name: 'completeName',
    fields:  {
      firstName: NucleoString({
        check: (value) => (value.length > 2)
      }),
      lastName: NucleoString()
    }
  });

  const User = new NucleoModel({
    name: 'user',
    fields: {
      name: completeNameType,
      age: NucleoNumber(),
      isAuthenticated: NucleoBoolean(),
      scope: new NucleoList(NucleoString()),
    }
  });

  it('should use nucleo state', () => {
    const [user, setUser] = nucleoState<any>(User) // make this any be able to receive User
    console.log('user state', user());
    const transaction = setUser({ name: { firstName: 'John' }, age: 28 });
    console.log('user state 2', user());
    console.log('transaction', transaction);
    const newUser = user() as any;
    expect(newUser.age).to.equal(28);
  })
});

