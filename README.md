# Nucleo

Nucleo creates and manages a strongly typed and predictable state container.

> Important note: This project is still under development. It's not recommended for production use yet, despite its basic functionalities are checked as done.  
## Roadmap

It's in this project milestones https://github.com/mtmr0x/nucleo/milestones;

For requesting any feature, please open an issue with the prefix "[FEATURE REQUEST]".

## Why

JavaScript is a really dynamic language which we can't always rely in the language resilience from types perspective. Every project has types problems and developers can not make sure all the time the data is predictable. Inspired by how GraphQL does a great job with safety and trustful data and Redux by its simplicity on storing state, Nucleo was idealized to make sure the data model (contracts) and the data types are expected and reliable.

## Installation

Using NPM:

```
npm install nucleojs --save
```

Using Yarn:

```
yarn add nucleojs
```

## Documentation

The links below take you to our `API_DOCUMENTATION.md` file present in this repository with deeper information and documentation to Nucleo usage.

- [Installation](API_DOCUMENTATION.md#installation)
- [Usage](API_DOCUMENTATION.md#usage)
- [Contracts](API_DOCUMENTATION.md#contracts)
- [Types](API_DOCUMENTATION.md#types)
  - [NucleoObject](API_DOCUMENTATION.md#creating-nucleoobject)
    - [Anatomy](API_DOCUMENTATION.md#nucleoobject-anatomy)
    - [Usage](API_DOCUMENTATION.md#nucleoobject-usage)
  - [NucleoList](API_DOCUMENTATION.md#creating-nucleolist)
    - [Anatomy](API_DOCUMENTATION.md#nucleolist-anatomy)
    - [Usage](API_DOCUMENTATION.md#nucleolist-usage)
  - [NucleoString](API_DOCUMENTATION.md#creating-nucleostring)
  - [NucleoNumber](API_DOCUMENTATION.md#creating-nucleonumber)
  - [NucleoBoolean](API_DOCUMENTATION.md#creating-nucleoboolean)
  - [NucleoStringAssertion](API_DOCUMENTATION.md#creating-nucleostringassertion)
    - [Anatomy](API_DOCUMENTATION.md#nucleostringassertion-anatomy)
    - [Usage](API_DOCUMENTATION.md#nucleostringassertion-usage)
  - [NucleoNumberAssertion](API_DOCUMENTATION.md#creating-nucleonumberassertion)
    - [Anatomy](API_DOCUMENTATION.md#nucleonumberassertion-anatomy)
    - [Usage](API_DOCUMENTATION.md#nucleonumberassertion-usage)
- [Creating the store](API_DOCUMENTATION.md#creating-the-store)
- [Dispatching and updating the store](API_DOCUMENTATION.md#dispatching-and-updating-the-store)
- [Get contracts in store](API_DOCUMENTATION.md#get-contracts-in-store)
- [Subscribing to changes](API_DOCUMENTATION.md#subscribing-to-changes)
- [Unsubscribing](API_DOCUMENTATION.md#unsubscribing)
- [Error management](API_DOCUMENTATION.md#error-management)

## Basic usage

Nucleo is written in TypeScript and compatible with es2016+. Importing for a ECMAScript usage:

```javascript
import { createStore } from 'nucleojs';
```

Importing from Nucleo source for TypeScript usage just add `/src` after nucleojs module:

```javascript
import { createStore } from 'nucleojs/src';
```

### Defining a data model (contract):

```javascript
import {
  NucleoString,
  NucleoNumber,
  NucleoObject,
  createStore
} from 'nucleojs'

const completeNameContract = new NucleoObject({
  name: 'completeNameContract',
  fields:  {
    firstName: NucleoString,
    lastName: NucleoString
  }
});

const userContract = new NucleoObject({
  name: 'user', // don't need to be the same name as the variable, but need to be unique
  fields: {
    name: completeNameContract,
    age: NucleoNumber
  }
});

const productsContract = new NucleoObject({
  name: 'products',
  fields: {
    title: NucleoString
  }
});

const contracts = {
  user: userContract,
  products: productsContract
};

```

### Creating the store

```javascript
import { createStore } from 'nucleojs';
import * as contracts from './contracts';

const store = createStore(contracts); // send contracts to create the store
const { dispatch, update, cloneState, subscribe } = store; // these 4 functions are returned from store creation
```

### Dispatching and updating the store

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

### Getting a state clone from store

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

## Development

### Tasks available

- `npm start` - Start development mode.
- `npm run nodemon` - Start development mode and waiting for changes.
- `npm run tests` - Run automated tests.
- `npm run lint` - Validate syntax of all Typescript files.
- `npm run compile` - Compile for production.

## Contributing

Want to contribute? [Follow these recommendations](https://github.com/mtmr0x/nucleo/blob/master/CONTRIBUTING.md).

## Versioning

To keep better organization of releases we follow the [Semantic Versioning 2.0.0](http://semver.org/) guidelines.

## Licence

[MIT Licence](https://github.com/mtmr0x/nucleo/blob/master/LICENCE.md) © [Matheus Marsiglio](http://mtmr0x.com)
