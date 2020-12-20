import save from './save';
import NucleoObject from './nucleoTypes/NucleoObject';
import NucleoList from './nucleoTypes/NucleoList';
import indexSearch from './indexSearch';
import subscribe, { listeners } from './subscribe';
import { Contracts } from './_types/Contracts';
import { TransactionStatus } from './transactionVerification';

export interface Store<S> {
  update: (contractName: string) => (data: S) => TransactionStatus;
  subscribe: (f: (arg: { contractName: string; data: S }) => void) => () => void;
  cloneState: (contract: string) => S;
}

function mountStore(store:any = {}, contracts: Contracts) {
  const contractsKeys: string[] = Object.keys(contracts);
  for (let cIndex = 0; cIndex < contractsKeys.length; cIndex++) {
    const currentKey = contractsKeys[cIndex];
    const currentItem = contracts[currentKey]
    if (currentItem instanceof NucleoObject) {
      store[currentKey] = {}
      mountStore(store[currentKey], currentItem.fields);
      continue;
    }
    if (currentItem instanceof NucleoList) {
      store[currentKey] = [];
      continue;
    }

    store[currentKey] = null;
  }
  return store;
}

function createStore<S>(contracts: Contracts): Store<S> {
  const __store__: any = mountStore({}, contracts);
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
    update: save({ contracts: __contracts__, store: __store__, listeners }),
    subscribe,
    cloneState: (contractName:string) => {
      if (!__contracts__[contractName]) {
        return undefined;
      }

      const [clonedData] = indexSearch({
        storeData: __store__[contractName],
        data: {},
      });

      return clonedData;
    }
  };
}

export {
  createStore
};
