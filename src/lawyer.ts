import NucleoObject from './nucleoTypes/NucleoObject';
import NucleoList from './nucleoTypes/NucleoList';

import { NucleoObjectType } from './_types/NucleoObjectType';
import indexSearch from './indexSearch';

import { Listener } from './subscribe';

const saveMethodReflection = (store: any, contractName: string, listeners: Array<Listener>) => ({
  dispatch: (data: any) => {
    return store[contractName] = indexSearch({
      contractName,
      storeData: data,
      data,
      listeners,
      newStoreData: {},
      newListenersData: {}
    });
  },
  update: (data: any) => {
    return store[contractName] = indexSearch({
      contractName,
      storeData: store[contractName],
      data,
      listeners,
      newStoreData: {},
      newListenersData: {}
    });
  }
});

interface LawyerInterface {
  contract: NucleoObjectType;
  data: any;
  saveMethod: 'update'|'dispatch';
  __errors__: Array<any>;
}

export default function lawyer({
  contract,
  data,
  saveMethod,
  __errors__,
}:LawyerInterface) {
  const { fields: contractFields }:any = contract;
  const dataKeys:Array<string> = Object.keys(data);
  const contractName:string = contract.name;

  if (dataKeys.length !== Object.keys(contractFields).length && saveMethod === 'dispatch') {
    throw Error(
      `Fatal error: In dispatch, the dispatched data and the contract must match in every level. For changing just few values from ${contractName} contract, use update() method.`
    );
  }

  for (let i = 0; dataKeys.length > i; i++) {
    const currentDataKey = data[dataKeys[i]];
    if (contractFields[dataKeys[i]] instanceof NucleoObject) {
      lawyer({
        contract: contractFields[dataKeys[i]],
        data: currentDataKey,
        saveMethod,
        __errors__
      });
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
              if (Object.keys(currentDataKey[d]).length !== Object.keys(_NucleoItemType.fields).length) {
                __errors__.push({
                  contract: _NucleoItemType.name,
                  error: 'You can not update a NucleoList of NucleoObject without its data according to contract in every level'
                });

                continue;
              }

              lawyer({
                contract: _NucleoItemType,
                data: currentDataKey[d],
                saveMethod,
                __errors__
              });
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

    if (contractFields[dataKeys[i]] && contractFields[dataKeys[i]].serialize && !contractFields[dataKeys[i]].serialize(currentDataKey)) {
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

  return (store:any, listeners:Array<Listener>) => {
    if (!__errors__.length) {
      saveMethodReflection(store, contractName, listeners)[saveMethod](data);
    }

    return {
      status: operationStatus,
      errors: __errors__,
      data,
    };
  };
}
