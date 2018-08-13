import { NucleoString, NucleoNumber } from './types/primitive';

const types = {
  example: {
    name: 'example',
    type: {
      alpha: NucleoString,
      delta: NucleoNumber
    }
  }
};

const comparison = (value: string, data: any) => {
  const { type } = types[value];
  const dataKeys = Object.keys(data);
  const typeKeys = Object.keys(type);
  let keysErrors = [];

  // loop checking object values comparison
  for (let i = 0; dataKeys.length >= i; i++) {
    // data: @argument
    // type: @variable

    // check if is a primitive type
    if (typeof data[dataKeys[i]] === 'object' || typeof data[dataKeys[i]] === 'function') {
      throw Error(`${data[dataKeys[i]]} type is not a primitive type. Expected a primitive type, got ${typeof data[dataKeys[i]]}`);
    }

    // check data and type primitive types
    if (typeof data[dataKeys[i]] !== typeof type[typeKeys[i]]) {
      keysErrors.push({ field: data[dataKeys[i]], error: `Non-equal type. Expected ${typeof type[typeKeys[i]]}, got ${typeof data[dataKeys[i]]}`});
    }
  }

  console.log(keysErrors);
  if (keysErrors.length) {
    throw Error(JSON.stringify({ errors: keysErrors }));
  }
}

const dispatcher = (value: string, data: any) => {
  const isValid = comparison(value, data);
  // const pointer = keyPointer(data);
};

export default comparison;

