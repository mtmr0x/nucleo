- [Installation](#installation)
- [Usage](#usage)
- [Contracts](#contracts)
- [Types](#types)
  - [NucleoObject](#creating-nucleoobject)
  - [NucleoList](#creating-nucleolist)
  - [NucleoString](#creating-nucleostring)
  - [NucleoNumber](#creating-nucleonumber)
  - [NucleoBoolean](#creating-nucleoboolean)
- [Creating the store](#creating-the-store)
- [Dispatching and updating the store](#dispatching-and-updating-the-store)
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
const { dispatch, update, getStore, subscribe } = store;

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

### Todo

## Types

### Creating NucleoObject

```javascript
NucleoObject({
  name: String,
  fields:  Object
});
```

**Usage**

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
  name: 'user', // don't need to be the same name as the variable, but need to be unique
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

```javascript
NucleoList(NucleoType);
```

**Usage**

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
  name: 'user', // don't need to be the same name as the variable, but need to be unique
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

## Creating NucleoString

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

## Creating NucleoNumber

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

## Creating NucleoBoolean

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

## Creating the store

```javascript
import { createStore } from 'nucleojs';
import * as contracts from './contracts';

const store = createStore(contracts); // send contracts to create the store
const { dispatch, update, getStore, subscribe } = store; // these 4 functions are returned from store creation
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
      lastName: 'Nor'
    },
    age: 27
  },
}
*/
```

## Get contracts in store

The `getStore` function returns all contracts that are in the store.

```javascript
const user = getStore().user;
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

## Subscribing to changes

You can simply subscribe to store changes by passing your listener functions to `subscribe` function. The listener must be a function and Nucleo will execute your listener sending an object argument with the updated contract for each update or dispatch to the store:

```javascript
const listener = ({ contractName }) => {
  const changes = getStore()[contractName];
  console.log(changes);
  /*
  {
    status: 'OK',
    errors: [],
    data: {
      name: {
        firstName: 'Robert',
        lastName: 'Nor'
      },
      age: 26
    },
  }
  */
} 
subscribe(listener); // if it's not a function, Nucleo will throw an error
update('user')({ age: 26 });
```

And inside Nucleo, your listener will be executed like this:

```javascript
listener({ contractName }); // This way you can understand better what was updated and consult Nucleo store as you wish
```

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