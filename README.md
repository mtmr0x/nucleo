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

### Defining a data model (contract):

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

### Creating the store:

```javascript
import { createStore } from 'nucleo';

const store = createStore(contracts); // send contracts to create the store
const { dispatch, update, getStore, subscribe } = store; // these 4 functions are returned from store creation
```

### Dispatching and updating the store:

Nucleo provides two methods of saving data, used for different approaches.

**dispatch:** works for saving data according to the full contract, used to save the very first contract state in the store or to update the whole contract in the store;

**update:** works for updating parts of data, it performs a index search in the object and save it. `update` will fail if you try to first save a contract to the store using it.

---

Dispatch function, considering user contract above:

```javascript

dispatch('user', { name: { firstName: 'John', lastName: 'Nor' } });
// it'll fail because it's missing age field

dispatch('user', { name: { firstName: 'John', lastName: 'Nor' }, age: 27 });
// it'll save the data to store properly
```

Update function, considering user contract above:

```javascript
update('user', { name: { firstName: 'John' }});
// it'll update only the user first name and only if this item has been already created in the store before
```

### Subscribing to changes

You can simply subscribe to store changes by passing your listener functions to `subscribe` function. The listener must be a function and Nucleo will execute your listener sending an object argument with the updated contract for each update or dispatch to the store:

```javascript
subscribe(listener); // if it's not a function, Nucleo will throw an error
```

And inside Nucleo, your listener will be executed like this:

```javascript
listener({ contractName }); // This way you can understand better what was updated and consult Nucleo store as you wish
```

