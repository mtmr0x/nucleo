# Nucleo

Nucleo creates and manages a strongly typed and predictable state container.

## Why

JavaScript is a language with some difficulties to rely on type safety. Every project has problems with types and develoeprs can not cover everything because most of it is due user input, couldn't being predictable. Inspired by how GraphQL does a great job with type safety and with a mission critical Front-End App I was working on back then I idealised Nucleo to work with a predefined model and make sure you will never save the wrong data to its state.

## Installation

Using NPM:

```
npm install nucleojs
```

Using Yarn:

```
yarn add nucleojs
```

> For TypeScript projects, there is no need to install `@types/nucleojs`, the `.d.ts` interfaces are in the project published at NPM. It should work with no issues.

## How to use it

Nucleo is written in TypeScript and compatible with es2016+. Importing for a ECMAScript usage:

```javascript
import { 
  nucleoState,
  NucleoString,
  NucleoNumber,
  NucleoBoolean,
  NucleoModel,
  NucleoList,
} from 'nucleojs';

// define your model
const User = new NucleoModel({
  name: 'user',
  fields: {
    firstName: NucleoString(),
    lastName: NucleoString(),
    age: NucleoNumber(),
    isAuthenticated: NucleoBoolean(),
    scope: new NucleoList(NucleoString()),
  }
});

// create the state
const [user, updateUser] = nucleoState(User) // make this any be able to receive User

// send data to user state
updateUser({ name: { firstName: 'John' }, age: 28 });

// retrieve data by calling the `user` function defined above
console.log(user()); // { firstName: 'John', lastName: null, age: 28, isAuthenticated: null, scope: [] }
```

## Development

### Tasks available

- `npm start` - Start development mode.
- `npm run nodemon` - Start development mode and waiting for changes.
- `npm run tests` - Run automated tests.
- `npm run lint` - Validate syntax of all Typescript files.
- `npm run compile` - Compile for release.

## Contributing

Want to contribute? [Follow these recommendations](https://github.com/mtmr0x/nucleo/blob/master/CONTRIBUTING.md).

## Versioning

To keep better organization of releases we follow the [Semantic Versioning 2.0.0](http://semver.org/) guidelines.

## Licence

[MIT Licence](https://github.com/mtmr0x/nucleo/blob/master/LICENCE.md) © [Matheus Marsiglio](http://mtmr0x.com)

