- [Installation](#installation)
- [Usage](#usage)
- [Contracts](#contracts)
- [Types](#types)
  - [NucleoObject](#creating-nucleoobject)
    - [Anatomy](#nucleoobject-anatomy)
    - [Usage](#nucleoobject-usage)
  - [NucleoList](#creating-nucleolist)
    - [Anatomy](#nucleolist-anatomy)
    - [Usage](#nucleolist-usage)
  - [NucleoString](#creating-nucleostring)
  - [NucleoNumber](#creating-nucleonumber)
  - [NucleoBoolean](#creating-nucleoboolean)
  - [NucleoStringAssertion](#creating-nucleostringassertion)
    - [Anatomy](#nucleostringassertion-anatomy)
    - [Usage](#nucleostringassertion-usage)
  - [NucleoNumberAssertion](#creating-nucleonumberassertion)
    - [Anatomy](#nucleonumberassertion-anatomy)
    - [Usage](#nucleonumberassertion-usage)
- [Creating the store](#creating-the-store)
- [Dispatching and updating the store](#dispatching-and-updating-the-store)
- [Update and Dispatch function signature](#Update-and-Dispatch-function-signature)
- [Get contracts in store](#get-contracts-in-store)
- [Subscribing to changes](#subscribing-to-changes)
- [Error management](#error-management)

## Installation

Using NPM:

```
npm install nucleojs --save
```

Using Yarn:

```
yarn add nucleojs
```

## Usage

```javascript
import {
  NucleoString,
  NucleoNumber,
  NucleoBoolean,
  NucleoObject,
  createStore
} from 'nucleojs';

const fullNameContract = new NucleoObject({
  name: 'fullName',
  fields:  {
    firstName: NucleoString,
    lastName: NucleoString
  }
});

const userContract = new NucleoObject({
  name: 'user',
  fields: {
    name: fullNameContract,
    age: NucleoNumber,
    disabled: NucleoBoolean
  }
});

const productsContract = new NucleoObject({
  name: 'products',
  fields: {
    title: NucleoString,
    price: NucleoNumber
  }
});

const contracts = {
  user: userContract,
  products: productsContract
};

const store = createStore(contracts);
const { dispatch, update, cloneState, subscribe } = store;

const user = dispatch('user')({ name: { firstName: 'John', lastName: 'Nor' }, age: 27 });
// it'll save the data to store properly

console.log(user);
/*
{
  status: 'OK',
  errors: [],
  data: {
    name: {
      firstName: 'John',
      lastName: 'Nor'
    },
    age: 27
  },
}
*/
```

## Contracts

Contracts are how your data is defined inside Nucleo. Basically contracts is how you define your `NucleoObject`s:

```javascript
const userContract = new NucleoObject({
  name: 'user',
  fields: {
    name: NucleoString,
    age: NucleoNumber,
    taxId: NucleoString
  }
});
```

The example below we defined a contract named as `user` and data in this contract will look like this:

```javascript
{
  name: 'Joseph Nor',
  age: 28,
  taxId: '987611654967'
}
```

Contracts are organized in a tree structure to be sent to Nucleo and create the store. Let's say you created the user contract above and a few more, they would behave like this to create the store:

```
const contracts = {
  user: userContract,
  products: productsContract,
  highlights: highlightsContract
};
```

`userContract`, `productsContract` and `highlightsContract` are instances of `NucleoObject`. Note that contracts are always instances of `NucleoObject`, if you try to create a store differently, it'll fail.

You can think in Nucleo contracts as data model contracts, as it is.

## Types

### Creating NucleoObject

#### NucleoObject Anatomy

```javascript
NucleoObject({
  name: String,
  fields: Object
});
```

Inside NucleoObject are expected two keys:

- `name`: every NucleoObject contract must have an unique name and this field is used to create and identify your item in your store.
- `fields`: is a plain object for the expected fields in this NucleoObject. Inside `fields` must have first level keys with Nucleo types values. If it's necessary to nest, you may create another NucleoObject inside this one.

#### NucleoObject Usage

```javascript
import {
  NucleoString,
  NucleoNumber,
  NucleoBoolean,
  NucleoObject
} from 'nucleojs'

const fullNameContract = new NucleoObject({
  name: 'fullName',
  fields:  {
    firstName: NucleoString,
    lastName: NucleoString
  }
});

const userContract = new NucleoObject({
  name: 'user',
  fields: {
    name: fullNameContract,
    age: NucleoNumber,
    disabled: NucleoBoolean
  }
});

const productsContract = new NucleoObject({
  name: 'products',
  fields: {
    title: NucleoString,
    price: NucleoNumber
  }
});

const contracts = {
  user: userContract,
  products: productsContract
};
```

### Creating NucleoList

#### NucleoList Anatomy

```javascript
NucleoList(NucleoType);
```

Inside Nucleo you can create lists of Nucleo types in your contracts. `NucleoList` accepts one argument which is expected a Nucleo type (`NucleoObject` or any Nucleo primitive are accepted). If you try to commit a new `NucleoList` with argument different from a Nucleo type it'll throw.

#### NucleoList Usage

```javascript
import {
  NucleoString,
  NucleoNumber,
  NucleoBoolean,
  NucleoObject,
  NucleoList
} from 'nucleojs'

const fullNameContract = new NucleoObject({
  name: 'fullName',
  fields:  {
    firstName: NucleoString,
    lastName: NucleoString
  }
});

const userContract = new NucleoObject({
  name: 'user',
  fields: {
    name: fullNameContract,
    age: NucleoNumber,
    disabled: NucleoBoolean,
  }
});

const usersContract = new NucleoObject({
  name: 'users',
  fields:  {
    data: new NucleoList(userContract)
  }
});

const contracts = {
  users: usersContract
};
```

### Creating NucleoString

```javascript
NucleoString: String;
```

**Usage**

```javascript
const personalInfoType = new NucleoObject({
  name: 'personalInfo',
  fields:  {
    firstName: NucleoString,
    lastName: NucleoString
  }
});
```

### Creating NucleoNumber

```javascript
NucleoNumber: Number;
```

**Usage**

```javascript
const personalInfoType = new NucleoObject({
  name: 'personalInfo',
  fields:  {
    firstName: NucleoString,
    lastName: NucleoString,
    age: NucleoNumber
  }
});
```

### Creating NucleoBoolean

```javascript
NucleoBoolean: Boolean;
```

**Usage**

```javascript
const userStatusType = new NucleoObject({
  name: 'userStatus',
  fields: {
    disabled: NucleoBoolean
  }
});
```

### Creating NucleoStringAssertion

#### NucleoStringAssertion Anatomy

`NucleoStringAssertion` receives a function as argument and execute it for validation and serialization in attempts to save data to its item. Nucleo validate the value type already and there is no need to check if it's a `string`.

```javascript
myFunc = value => Boolean

NucleoStringAssertion(myFunc)
```

- `myFunc`: a function declaration under your control, you declare it for be used as rule for validating that field. It must return a boolean according to following rules:
  - `true`: the assertion is as expected and can be saved in store;
  - `false`: the assertion is not what's expected and it'll make Nucleo avoid saving data.
- `value`: value that is being validated to be saved in store;

#### NucleoStringAssertion Usage

```javascript
function taxIdValidation(value:string) {
  return value.length === 11;
}

const userType = new NucleoObject({
  name: 'user',
  fields:  {
    name: NucleoString,
    taxId: new NucleoStringAssertion(taxIdValidation)
  }
});
```

### Creating NucleoNumberAssertion

#### NucleoNumberAssertion Anatomy

`NucleoNumberAssertion` receives a function as argument and execute it for validation and serialization in attempts to save data to its item. Nucleo validate the value type already and there is no need to check if it's a `number`.

```javascript
myFunc = value => Boolean

NucleoNumberAssertion(myFunc)
```

- `myFunc`: a function declaration under your control, you declare it for be used as rule for validating that field. It must return a boolean according to following rules:
  - `true`: the assertion is as expected and can be saved in store;
  - `false`: the assertion is not what's expected and it'll make Nucleo avoid saving data.
- `value`: value that is being validated to be saved in store;

#### NucleoNumberAssertion Usage

```javascript
function ageValidation(value:number) {
  return value < 100;
}

const userType = new NucleoObject({
  name: 'user',
  fields:  {
    name: NucleoString,
    age: new NucleoNumberAssertion(ageValidation)
  }
});
```

## Creating the store

```javascript
import { createStore } from 'nucleojs';
import * as contracts from './contracts';

const store = createStore(contracts); // send contracts to create the store
const { dispatch, update, cloneState, subscribe } = store; // these 4 functions are returned from store creation
```

## Dispatching and updating the store

Nucleo provides two methods of saving data, used for different approaches.

**dispatch:** works for saving data according to the full contract, used to save the very first contract state in the store or to update the whole contract in the store;

**update:** works for updating parts of data, it performs a index search in the object and save it. `update` will fail if you try to first save a contract to the store using it.

---

Dispatch function, considering user contract above:

```javascript

let user = dispatch('user')({ name: { firstName: 'John', lastName: 'Nor' } });
// it'll fail because it's missing age field

user = dispatch('user')({ name: { firstName: 'John', lastName: 'Nor' }, age: 27 });
// it'll save the data to store properly

console.log(user);
/*
{
  status: 'OK',
  errors: [],
  data: {
    name: {
      firstName: 'John',
      lastName: 'Nor'
    },
    age: 27
  },
}
*/
```

Update function, considering user contract above:

```javascript
const user = update('user')({ name: { firstName: 'Robert' }});
// it'll update only the user first name and only if this item has been already created in the store before

console.log(user);
/*
{
  status: 'OK',
  errors: [],
  data: {
    name: {
      firstName: 'Robert',
    },
  },
}

It'll return the data you asked to save. To receive the new store, you will have to clone this state or subscribe to Nucleo changes through subscribe function
Check documentation for cloneState in the next section
*/
const newUser = cloneState('user');
console.log(newUser);
/*
{
  name: {
    firstName: 'Robert',
    lastName: 'Nor',
  },
  age: 27,
}
*/
```

#### Update and Dispatch function signature

`update` and `dispatch` functions have the same signature albeit a discrete behavioral difference (you can find this difference in .

**Both are curried functions:**

 - `update(<contract_name>)(<data_to_save_in_contract>)`;
 - `dispatch(<contract_name>)(<data_to_save_in_contract>)`.

`<contract_name>`: a `string` for the contract name you want to update or dispatch. It's the `name` field for every new `NucleoObject` in the contracts definition. Those must be unique. You can find more information about contracts in API_DOCUMENTATION.md.

`<data_to_save_in_contract>`: must follow its contract model. For understanding how to use `update` and `dispatch` for saving data, check API_DOCUMENTATION.md in "Dispatching and updating the store" section.

**Both return the same object interface:**

```javascript
{
  status: 'OK' | 'NOK', // a string return 'OK' for success cases and 'NOK' for errors
  errors: [], // in case of errors, it will return the list of errors
  data: { ... } // the data you just tried to save in store
}
```

 - `status`: a string return 'OK' for success cases and 'NOK' for errors;
 - `errors`: a list of objects containing the errors in this operation. Usually related to contract violations. You can find more details in API_DOCUMENTATION.md at "Error management" area.
 - `data`: This is the exactly same object you tried to save at store for comparison reasons in cases of errors.

## Getting a state clone from store

The `cloneState` function receives one argument which is the contract name in store, performs a deep clone using the contracts data model as a map to predict the key/values of that contract and be able to return it with great performance.

```javascript
const user = cloneState('user');
console.log(user);
/*
{
  name: {
    firstName: 'Robert',
    lastName: 'Nor'
  },
  age: 27
}
*/
```

## Subscribing to changes

The `subscribe` function receives as argument a function and for each update in the store, Nucleo executes the listener passing as parameter an object containing `contractName` and `data`:

- `contractName`: `string` containing the updated contract name;
- `data`: `Object` containing a deep clone of the data saved in store.

```javascript
const listener = ({ contractName, data }) => {
  console.log(data);
  /*
  {
    name: {
      firstName: 'Robert',
      lastName: 'Nor'
    },
    age: 26
  }
  */
}
subscribe(listener); // if it's not a function, Nucleo will throw an error
update('user')({ age: 26 });
```

And inside Nucleo, your listener will be executed like this:

```javascript
listener({ contractName, data }); // This way you can understand better what was updated and consult Nucleo store as you wish
```

## Unsubscribing

Subscribe function returns a `unsubscribe` function that can understand context and properly unsubscribe the right listener.

```javascript
const unsubscribe = subscribe(func);

// when you need to unsubscribe is just call its function
unsubscribe(); // done :)
```

## Subscribing multiple listeners

Nucleo provides only one way of subscribing to changes, but saves the listeners as a list of functions inside of it. You can execute multiple times `subscribe` with all your listeners:

```javascript
subscribe(listener1);
subscribe(listener2);
subscribe(listener3);
subscribe(listener4);

// or

const listeners = [listener1, listener2, listener3, listener4];

listeners.map(listener => subscribe(listener));
```

Nucleo will execute one by one, following the order you provided.

## Error management

Nucleo makes error management easy by type checking every level of contracts and returning an Object human and machine readable. The `update` and `dispatch` methods return an object with the following structure:

```javascript
{
  status:  'NOK',
  errors: [
    {
      error: '<some key> is not in <some contract> contract and can not be saved in store',
      contract: 'contractName',
      field: 'fieldName'
    }
  ],
  data: { ... } // the data you just tried to save in store
}
```

Code example:

```javascript
import { 
  NucleoString,
  NucleoObject
} from 'nucleojs';

const userType = new NucleoObject({
  name: 'user',
  fields: {
    name: NucleoString,
  }
});

const contracts = {
  user: userType
};

const { update } = createStore(contracts); // send contracts to create the store

const user = update('user')({ age: 140 });

console.log(user.errors); // here you'll find the error below:
/*

  [
    {
      error: 'age field does not match its rules according to user contract',
      contract: 'user',
      field: 'age'
    }
  ]
}
*/
```

In cases with no errors, `errors` list will be an empty list and `status` will be `OK`

```javascript
{
  status: 'OK',
  errors: []
  data: { ... } // the data you just tried to save in store
}
```
