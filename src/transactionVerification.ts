import {
  NucleoModel,
  NucleoList,
} from './types';

type TransactionError = {
  model: string;
  error: string;
  field?: string;
}

type TransactionVerification = {
  model: NucleoModel;
  data: any;
  __errors__?: Array<TransactionError>;
}

export type TransactionStatus = {
  status: string,
  errors: Array<TransactionError>
}

export default function transactionVerification({
  model,
  data,
  __errors__ = [],
}: TransactionVerification): TransactionStatus {
  const { fields: modelFields } = model;
  console.log('aqui', data);
  const dataKeys:Array<string> = Object.keys(data);
  const modelName:string = model.name;

  for (let i = 0; dataKeys.length > i; i++) {
    const currentDataKey = data[dataKeys[i]];
    if (modelFields[dataKeys[i]] instanceof NucleoModel) {
      transactionVerification({
        model: modelFields[dataKeys[i]] as NucleoModel,
        data: currentDataKey,
        __errors__
      });
      continue;
    }

    // LISTS ARE HERE
    if ((modelFields[dataKeys[i]] instanceof NucleoList) && Array.isArray(currentDataKey)) {
      const _listItemType: string = modelFields[dataKeys[i]].getListChildrenType();
      const modelFieldsItem: any = modelFields[dataKeys[i]];
      const _NucleoItemType = modelFieldsItem[_listItemType];

      const dataTypeMapper = (): { [key: string]: () => void } => ({
        NucleoPrimitive: () => {
          const { serialize, Type } = _NucleoItemType;

          for (let d = 0; d < currentDataKey.length; d++) {
            if (!serialize(currentDataKey[d])) {
              __errors__.push({
                model: modelName,
                error: `NucleoList expect to receive ${Type}, but got ${typeof currentDataKey[d]}`
              });
            }
          }
        },
        NucleoModel: () => {
          if (_NucleoItemType instanceof NucleoModel) {
            // for (let d = 0; d < currentDataKey.length; d++) {
            for (let d = 0; d < Object.keys(_NucleoItemType.fields).length; d++) {
              console.log('>>>', _NucleoItemType.fields);
              // if (Object.keys(currentDataKey[d]).length !== Object.keys(_NucleoItemType.fields).length) {
              //   __errors__.push({
              //     model: _NucleoItemType.name,
              //     error: 'You can not update a NucleoList of NucleoModel without its data according to model in every level'
              //   });

              //   continue;
              // }

              transactionVerification({
                model: _NucleoItemType,
                data: currentDataKey[d] || {},
                __errors__
              });
            }
          }
        },
      });

      dataTypeMapper()[_listItemType]();
      continue;
    } else if ((modelFields[dataKeys[i]] instanceof NucleoList) && !Array.isArray(currentDataKey)) {
      __errors__.push({
        model: modelName,
        error: `NucleoList should receive data as list, but got ${typeof currentDataKey}`
      });
    }

    if (!modelFields[dataKeys[i]]) {
      __errors__.push({
        model: modelName,
        error: `${dataKeys[i]} is not in ${modelName} model and can not be saved in store.`
      });
    }

    if (modelFields[dataKeys[i]] && modelFields[dataKeys[i]].serialize && !modelFields[dataKeys[i]].serialize(currentDataKey)) {
      __errors__.push({
        model: modelName,
        error: `${dataKeys[i]} does not match its rules according to ${modelName} model`
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

