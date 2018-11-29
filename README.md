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
      lastName: 'Nor'
    },
    age: 27
  },
}
*/
```

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

## Contributing

Nucleo is open to any contribution made by community. And by contributing to Nucleo, you agree to our [code of conduct](https://github.com/mtmr0x/nucleo/blob/master/CODE_OF_CONDUCT.md)

### Bugs and improvements

Open a issue with the prefix [BUG] or [FEATURE REQUEST] for one of those cases with no restrictions, and try to clarify all your points bringing examples and well-founded arguments. If you need help in something, just make it clear at the beginning of your issue.

### Pull Requests

Once you want to fix something for Nucleo, you can just go ahead and do it, but for making people know the problem and that you're working on it (and maybe can get even more information) open an issue about it, and if necessary, just point that you desire to fix it, or if some help is needed.

For new features, it's highly recommended to open an issue first and discuss more to make sure this feature is really required to the project.

### Roadmap

Every approved issue as features and issues for fixes will be placed at Nucleo roadmap, in this repository milestones.

### Critical fixes

In case of critical fixes, which applies to everything that would directly interfere in Nucleo functionalities, we'll work hard to solve it and publish a new minor patch as soon as possible.

