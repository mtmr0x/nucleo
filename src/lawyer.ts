import NucleoObject from './nucleoTypes/NucleoObject';
import NucleoList from './nucleoTypes/NucleoList';

import { NucleoObjectType } from './_types/NucleoObjectType';

export default function lawyer(contract: NucleoObjectType, data: any) {
  const contractKeys:Array<string> = Object.keys(contract);
  const { fields: contractFields }:any = contract;
  const dataKeys:Array<string> = Object.keys(data);
  const contractName:string = contract.name;
  let __errors__: Array<any> =  [];

  // loop checking object values comparison
  for (let i = 0; dataKeys.length > i; i++) {
    const currentDataKey = data[dataKeys[i]];
    // recursion to call itself when is NucleoObject instance
    if (contractFields[dataKeys[i]] instanceof NucleoObject) {
      lawyer(contractFields[dataKeys[i]], currentDataKey);
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
          // TODO: check in NucleoList to this.NucleoObject keep as a instanceof NucleoObject to make this validation here
          if (_NucleoItemType instanceof NucleoObject) {
            console.log('OLOCO');
          }
          console.log('> Lawyer NucleoList _NucleoItemType', _NucleoItemType);
          for (let d = 0; d < currentDataKey.length; d++) {
            lawyer(_NucleoItemType, currentDataKey[d]);
            console.log('asdf');
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
        error: `${dataKeys[i]} field was expected as ${contractFields[dataKeys[i]].Type} but got ${typeof currentDataKey}`
      });
    }
  }

  if (__errors__.length) {
    throw Error(JSON.stringify({ errors: __errors__ }));
  }

  console.log('> lawyer errors', __errors__);

  // TODO: compare contract with received and every operation be a update, not a rewrite
  // TODO: actually it's not really necessary either. Side effects of programming late, right?
  return (store:any) => {
    return store[contractName] = data;
  }
}

