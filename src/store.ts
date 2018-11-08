import save from './save';
import NucleoObject from './nucleoTypes/NucleoObject';
import indexSearch from './indexSearch';

let listeners: Array<Function> = [];

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

function getStore(store: any) {
  return () => {
    return store;
  };
}

function createStore(contracts: any) {
  let __store__:any = {};
  let __contracts__: any = {};
  const contractsKeys: any = Object.keys(contracts);

  for (let c:number = 0; c < contractsKeys.length; c++) {
    const current: any = contracts[contractsKeys[c]];
    if (!(current instanceof NucleoObject)) {
      throw Error(
        `Each contract must be instances of NucleoObject. Received ${JSON.stringify(current)}.\nTo understand more, check the documentation about creating a contract in Nucleo here: https://github.com/mtmr0x/nucleo`
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
    dispatch: save({ contracts: __contracts__, store: __store__, listeners, saveMethod: 'dispatch' }),
    update: save({ contracts: __contracts__, store: __store__, listeners, saveMethod: 'update' }),
    subscribe,
    getStore: getStore(__store__),
    cloneState: (contractName:string) => indexSearch({
      contractName,
      storeData: __store__[contractName],
      data: {},
      listeners: undefined,
      newStoreData: {},
      newListenersData: {}
    })
  };
}

export {
  createStore
};

