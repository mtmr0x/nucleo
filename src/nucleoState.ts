import save from './save';
import indexSearch from './indexSearch';
import subscribe, { listeners } from './subscribe';
import { TransactionStatus } from './transactionVerification';
import {
  NucleoObject,
  NucleoList,
} from './types';

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

type NucleoState<S> = [
  () => S,
  (d: S) => TransactionStatus,
  (f: (arg: { modelName: string; data: S }) => void) => () => void,
];

export function nucleoState<S>(model: NucleoObject): NucleoState<S> {
  if (!(model instanceof NucleoObject)) {
    throw Error(`Your model must be a NucleoObject. Import it like "import { NucleoObject } from 'nucleojs' and create the state from it. Check the documentation at <url here>`);
  }

  const contracts: { [key:string]: any } = {}
  contracts[model.name] = model;
  const __state__: any = mountState({}, contracts);

  const setState = save({ model, state: __state__, listeners });
  const getState = <T>(): T => {
    const [clonedData] = indexSearch({ storeData: __state__[model.name], data: {} });
    return clonedData;
  }

  return [getState, setState(model.name), subscribe];
}

