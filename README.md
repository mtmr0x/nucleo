# Nucleo

Nucleo creates and manages a strongly typed and predictable state container.

> Important note: This project is still under development. It's not recommended for production use yet. Some bug fixes are being worked on and we're improving documentation and tests to make sure everything is running as expected.

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
  - [NucleoList](API_DOCUMENTATION.md#creating-nucleolist)
  - [NucleoString](API_DOCUMENTATION.md#creating-nucleostring)
  - [NucleoNumber](API_DOCUMENTATION.md#creating-nucleonumber)
  - [NucleoBoolean](API_DOCUMENTATION.md#creating-nucleoboolean)
- [Creating the store](API_DOCUMENTATION.md#creating-the-store)
- [Dispatching and updating the store](API_DOCUMENTATION.md#dispatching-and-updating-the-store)
- [Get contracts in store](API_DOCUMENTATION.md#get-contracts-in-store)
- [Subscribing to changes](API_DOCUMENTATION.md#subscribing-to-changes)
- [Error management](API_DOCUMENTATION.md#error-management)

## Basic usage

### Defining a data model (contract):

```javascript
import {
  NucleoString,
  NucleoNumber,
  NucleoObject
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

