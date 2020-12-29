import save from './save';
import indexSearch from './indexSearch';
import subscribe, { listeners } from './subscribe';
import { TransactionStatus } from './transactionVerification';
import {
  NucleoModel,
  NucleoList,
} from './types';

function mountState(state:any = {}, models: any) {
  const contractsKeys: string[] = Object.keys(models);
  for (let cIndex = 0; cIndex < contractsKeys.length; cIndex++) {
    const currentKey = contractsKeys[cIndex];
    const currentItem = models[currentKey]
    if (currentItem instanceof NucleoModel) {
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

export function nucleoState<S>(model: NucleoModel): NucleoState<S> {
  if (!(model instanceof NucleoModel)) {
    throw Error(`Your model must be a NucleoModel. Import it like "import { NucleoModel } from 'nucleojs' and create the state from it. Check the documentation at <url here>`);
  }

  const models: { [key:string]: any } = {}
  models[model.name] = model;
  const __state__: any = mountState({}, models);

  const setState = save({ model, state: __state__, listeners });
  const getState = <T>(): T => {
    const [clonedData] = indexSearch({ storeData: __state__[model.name], data: {} });
    return clonedData;
  }

  return [getState, setState(model.name), subscribe];
}

