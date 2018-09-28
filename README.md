# Nucleo

Nucleo creates and manages a strongly typed and predictable state container free of dependencies. It was built in TypeScript for be ran in any JavaScript ecosystem.

> Important note: This project is still under development. It's not recommended for production use yet, despite Nucleo basic functionalities are checked as done.

## Why

JavaScript is a really dynamic language which we can't always rely in the language resilience from types perspective. Every project has types problems and developers can not make sure all the time the data is predictable. Inspired by how GraphQL does a great job with safety and trustful data and Redux by its simplicity on storing state, Nucleo was idealized to make sure the data model (contracts) and the data types are expected and reliable.

## Installation

Using NPM:

```
npm i nucleo
```

Using Yarn:

```
yadn add nucleo
```

## Usage

Defining a data model (contract):

```javascript
import {
  NucleoString,
  NucleoNumber,
  NucleoObject
} from 'nucleo'

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
    name: completeNameType,
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
}
```

Creating the store:

```javascript
import { createStore } from 'nucleo';

const store = createStore(contracts); // send contracts to create the store
const { dispatch, update, getStore, subscribe } = store; // these 4 functions are returned from store creation
```

Dispatching and updating the store:

```javascript

const userNewData = {
  
}

dispatch('user', { name: { fir } })

```

