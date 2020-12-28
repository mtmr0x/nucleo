import save from './save';
import indexSearch from './indexSearch';
import subscribe, { listeners } from './subscribe';
import { TransactionStatus } from './transactionVerification';
import {
  NucleoObject,
  NucleoList,
  Contracts,
  NucleoObjectType,
} from './types';

export interface Store<S> {
  update: (contractName: string) => (data: S) => TransactionStatus;
  subscribe: (f: (arg: { contractName: string; data: S }) => void) => () => void;
  cloneState: (contract: string) => S;
}

// function mountStore(store:any = {}, contracts: Contracts) {
//   const contractsKeys: string[] = Object.keys(contracts);
//   for (let cIndex = 0; cIndex < contractsKeys.length; cIndex++) {
//     const currentKey = contractsKeys[cIndex];
//     const currentItem = contracts[currentKey]
//     if (currentItem instanceof NucleoObject) {
//       store[currentKey] = {}
//       mountStore(store[currentKey], currentItem.fields);
//       continue;
//     }
//     if (currentItem instanceof NucleoList) {
//       store[currentKey] = [];
//       continue;
//     }
//
//     store[currentKey] = null;
//   }
//   return store;
// }

function mountState(state:any = {}, contracts: any) {
  const contractsKeys: string[] = Object.keys(contracts);
  for (let cIndex = 0; cIndex < contractsKeys.length; cIndex++) {
    const currentKey = contractsKeys[cIndex];
    const currentItem = contracts[currentKey]
    if (currentItem instanceof NucleoObject) {
      state[currentKey] = {}
      mountState(state[currentKey], currentItem.fields);
      continue;
    }
    if (currentItem instanceof NucleoList) {
      state[currentKey] = [];
      continue;
    }

    state[currentKey] = null;
  }
  return state;
}

type UseNucleoState<S> = [
  () => S,
  (d: S) => TransactionStatus,
  (f: (arg: { contractName: string; data: S }) => void) => () => void,
];

export function useNucleoState<S>(contract: NucleoObject): UseNucleoState<S> { // maybe rename NucleoObject to NucleoState?
  if (!(contract instanceof NucleoObject)) {
    throw Error(`Your contract must be a NucleoObject. Import it like "import { NucleoObject } from 'nucleojs' and create the state from it. Check the documentation at <url here>`);
  }

  const contracts: { [key:string]: any } = {}
  contracts[contract.name] = contract;
  const __state__: any = mountState({}, contracts);

  const setState = save({ contract, store: __state__, listeners });
  const getState = <T>(): T => {
    const [clonedData] = indexSearch({ storeData: __state__[contract.name], data: {} });
    return clonedData;
  }

  return [getState, setState(contract.name), subscribe];
}

// export function createStore<S>(contracts: Contracts): Store<S> {
//   const __store__: any = mountStore({}, contracts);
//   let __contracts__: any = {};
//   const contractsKeys: string[] = Object.keys(contracts);
//
//   for (let c = 0; c < contractsKeys.length; c++) {
//     const current = contracts[contractsKeys[c]];
//     if (!(current instanceof NucleoObject)) {
//       throw Error(
//         `Each contract must be instances of NucleoObject. Received ${JSON.stringify(current)}.\nTo understand more, check the documentation about creating a contract in Nucleo here: https://github.com/mtmr0x/nucleo`
//       );
//     }
//
//     const { fields = {} } = current;
//     if (__contracts__[current.name]) {
//       __contracts__ = {};
//       throw Error(
//         `Two contracts can not have the same name. Received more than one ${current.name} contract`
//       );
//     }
//     __contracts__[current.name] = { ...fields };
//   }
//
//   return {
//     update: save({ contracts: __contracts__, store: __store__, listeners }),
//     subscribe,
//     cloneState: (contractName:string) => {
//       if (!__contracts__[contractName]) {
//         return undefined;
//       }
//
//       const [clonedData] = indexSearch({
//         storeData: __store__[contractName],
//         data: {},
//       });
//
//       return clonedData;
//     }
//   };
// }

