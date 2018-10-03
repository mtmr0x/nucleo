import NucleoObject from './nucleoTypes/NucleoObject';
import NucleoList from './nucleoTypes/NucleoList';

import { NucleoObjectType } from './_types/NucleoObjectType';

const  executeListeners = (contractName: string, listeners: Array<Function>) => {
  for (let i = 0; i < listeners.length; i++) {
    listeners[i]({ contractName });
  }
};

const saveMethodReflection = (store: any, contractName: string) => ({
  dispatch: (data: any) => {
    return store[contractName] = data;
  },
  update: (data: any) => {
    return store[contractName] = Object.assign(store[contractName], data);
  }
});

export default function lawyer(contract: NucleoObjectType, data: any, saveMethod:'update'|'dispatch') {
  const { fields: contractFields }:any = contract;
  const dataKeys:Array<string> = Object.keys(data);
  const contractName:string = contract.name;
  let __errors__: Array<any> = [];

  if (dataKeys.length !== Object.keys(contractFields).length && saveMethod === 'dispatch') {
    throw Error(
      `Fata error: In dispatch, the dispatched data and the contract must match in every level. For changing just few values from ${contractName} contract, use update() method.`
    );
  }

  // loop checking object values comparison
  for (let i = 0; dataKeys.length > i; i++) {
    const currentDataKey = data[dataKeys[i]];
    // recursion to call itself when is NucleoObject instance
    if (contractFields[dataKeys[i]] instanceof NucleoObject) {
      lawyer(contractFields[dataKeys[i]], currentDataKey, saveMethod);
      continue;
    }

    if ((contractFields[dataKeys[i]] instanceof NucleoList) && Array.isArray(currentDataKey)) {
      const _listItemType = contractFields[dataKeys[i]].getListChildrenType();
      const _NucleoItemType = contractFields[dataKeys[i]][_listItemType];

      const dataTypeReflection:Function = () => ({
        NucleoPrimitive: () => {
          const { serialize, Type } = _NucleoItemType;

          for (let d = 0; d < currentDataKey.length; d++) {
            if (!serialize(currentDataKey[d])) {
              __errors__.push({
                contract: contractName,
                error: `NucleoList expect to receive ${Type}, but got ${typeof currentDataKey[d]}`
              });
            }
          }
        },
        NucleoObject: () => {
          if (_NucleoItemType instanceof NucleoObject) {
            for (let d = 0; d < currentDataKey.length; d++) {
              lawyer(_NucleoItemType, currentDataKey[d], saveMethod);
            }
          }
        },
      });

      dataTypeReflection()[_listItemType]();
      continue;
    } else if ((contractFields[dataKeys[i]] instanceof NucleoList) && !Array.isArray(currentDataKey)) {
      __errors__.push({
        contract: contractName,
        error: `NucleoList should receive data as list, but got ${typeof currentDataKey}`
      });
    }

    if (!contractFields[dataKeys[i]]) {
      __errors__.push({
        contract: contractName,
        error: `${dataKeys[i]} is not in ${contractName} contract and can not be saved in store.`
      });
    }

    if (contractFields[dataKeys[i]] && !contractFields[dataKeys[i]].serialize(currentDataKey)) {
      __errors__.push({
        contract: contractName,
        field: contractFields[dataKeys[i]],
        error: `${dataKeys[i]} does not match its rules according to ${contractName} contract`
      });
    }
  }

  let operationStatus:''|'NOK'|'OK' = '';
  if (__errors__.length) {
    operationStatus = 'NOK';
  } else {
    operationStatus = 'OK';
  }

  return (store:any, listeners:Array<Function>) => {
    saveMethodReflection(store, contractName)[saveMethod](data);
    executeListeners(contractName, listeners);

    return {
      status: operationStatus,
      errors: __errors__,
      data,
    }
  }
}

