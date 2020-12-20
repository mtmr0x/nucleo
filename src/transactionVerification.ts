import NucleoObject from './nucleoTypes/NucleoObject';
import NucleoList from './nucleoTypes/NucleoList';

import { NucleoObjectType } from './_types/NucleoObjectType';

type TransactionError = {
  contract: string;
  error: string;
  field?: string;
}

type TransactionVerification = {
  contract: NucleoObjectType;
  data: any;
  __errors__?: Array<TransactionError>;
}

export type TransactionStatus = {
  status: string,
  errors: Array<TransactionError>
}

export default function transactionVerification({
  contract,
  data,
  __errors__ = [],
}: TransactionVerification): TransactionStatus {
  const { fields: contractFields } = contract;
  const dataKeys:Array<string> = Object.keys(data);
  const contractName:string = contract.name;

  for (let i = 0; dataKeys.length > i; i++) {
    const currentDataKey = data[dataKeys[i]];
    if (contractFields[dataKeys[i]] instanceof NucleoObject) {
      transactionVerification({
        contract: contractFields[dataKeys[i]],
        data: currentDataKey,
        __errors__
      });
      continue;
    }

    if ((contractFields[dataKeys[i]] instanceof NucleoList) && Array.isArray(currentDataKey)) {
      const _listItemType = contractFields[dataKeys[i]].getListChildrenType();
      const _NucleoItemType = contractFields[dataKeys[i]][_listItemType];

      const dataTypeMapper = (): { [key: string]: () => void } => ({
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

              transactionVerification({
                contract: _NucleoItemType,
                data: currentDataKey[d],
                __errors__
              });
            }
          }
        },
      });

      dataTypeMapper()[_listItemType]();
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

  return {
    status: operationStatus,
    errors: __errors__,
  };
}

