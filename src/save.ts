import indexSearch from './indexSearch';
import executeListeners from './executeListeners';
import transactionVerification from './transactionVerification';

import { Listener } from './subscribe';
import { NucleoObject } from './types';

interface Save {
  contract: NucleoObject;
  store: any;
  listeners: Array<Listener>;
}

export default function save({
  contract,
  store,
  listeners,
}: Save) {
  return (contractName: string) => {
    return (data: any) => {
      const transactionStatus = transactionVerification({
        contract,
        data,
      });

      if (!transactionStatus.errors.length) {
        const [updatedData, clonedUpdatedData] = indexSearch({
          storeData: store[contractName],
          data,
        });

        store[contractName] = updatedData;

        if (listeners && listeners.length) {
          executeListeners(contractName, listeners, clonedUpdatedData);
        }
      }

      return transactionStatus;
    };
  };
}
