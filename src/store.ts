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

