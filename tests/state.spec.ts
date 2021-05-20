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

  it('should properly update second level object', () => {
    const [user, setUser] = nucleoState<any>(User) // make this any be able to receive User
    setUser({ name: { firstName: 'John' }, age: 28, scope: ['a', 'b'] });
    setUser({ name: { lastName: 'Doe' } });
    const newUser = user() as any;
    expect(newUser.name.firstName).to.equal('John');
    expect(newUser.name.lastName).to.equal('Doe');
    expect(newUser.age).to.equal(28);
  });

  it('should update only the list key', () => {
    const [user, setUser] = nucleoState<any>(User) // make this any be able to receive User
    setUser({ name: { firstName: 'John' }, age: 28, scope: ['a', 'b'] });
    setUser({ scope: ['v'] });
    const newUser = user() as any;
    expect(newUser.scope[0]).to.equal('v');
    expect(newUser.scope.length).to.equal(1);
  });

  it('should update boolean values', () => {
    const [user, setUser] = nucleoState<any>(User) // make this any be able to receive User
    setUser({ name: { firstName: 'John' }, age: 28, scope: ['a', 'b'] });
    setUser({ isAuthenticated: false });
    const newUser = user() as any;
    expect(newUser.name.firstName).to.equal('John');
    expect(newUser.age).to.equal(28);
    expect(newUser.scope.length).to.equal(2);
    expect(newUser.isAuthenticated).to.equal(false);
  })
});

