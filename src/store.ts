import save from './save';
import NucleoObject from './nucleoTypes/NucleoObject';
import indexSearch from './indexSearch';
import subscribe, { listeners } from './subscribe';
import { Contracts } from './_types/Contracts';
import { Update } from './_types/Update';

export interface Store<T> {
  dispatch: (contract: string) => (d: T) => Update<T>;
  update: (contract: string) => (d: T) => Update<T>;
  subscribe: (f: (arg: { contractName: string; data: T }) => void) => () => void;
  cloneState: (contract: string) => T;
}

function createStore<S>(contracts: Contracts): Store<S> {
  const __store__: any = {};
  let __contracts__: any = {};
  const contractsKeys: string[] = Object.keys(contracts);

  for (let c = 0; c < contractsKeys.length; c++) {
    const current = contracts[contractsKeys[c]];
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
    cloneState: (contractName:string) => {
      if (!__contracts__[contractName]) {
        return undefined;
      }

      return indexSearch({
        contractName,
        storeData: __store__[contractName],
        data: {},
        listeners: undefined,
        newStoreData: {},
        newListenersData: {}
      });
    }
  };
}

export {
  createStore
};
