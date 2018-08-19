import dispatch from './dispatcher';
import NucleoObjectType from './types/NucleoObjectType';

let listeners: Array<Function | void> = [];

type ModelType = {
  name: string,
  fields: any
};

function subscribe(listener: Function) {
  if (typeof listener !== 'function') {
    throw Error('Expected listener to be a function');
  }
  return listeners.push(listener);
}

function createStore(contracts: any) {
  let __store__:any = {};
  let __contracts__: any = {};
  if (JSON.stringify(__contracts__) !== '{}') {
    throw Error('You can\'t create a store when it\'s already created.');
  }

  const contractsKeys: any = Object.keys(contracts);

  for (let c = 0; c < contractsKeys.length; c++) {
    const current: any = contracts[contractsKeys[c]];
    if (!(current instanceof NucleoObjectType)) {
      throw Error(
        `Each contract must be instances of NucleoObjectType. Received ${JSON.stringify(current)}.\nTo understand more, check the documentation about creating a contract in Nucleo here: https://github.com/mtmr0x/nucleo`
      );
    }

    const { fields = {} } = current;
    if (__contracts__[current.name]) {
      __contracts__ = {};
      throw Error(
        `Two contracts can not have the same name. Received more than one ${current.name} contract`
      );
    }
    __contracts__[current.name] = { ...fields };
  }

  return {
    dispatch: dispatch(__contracts__),
    subscribe
  };
}

export {
  createStore
};

