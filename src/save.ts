import indexSearch from './indexSearch';
import executeListeners from './executeListeners';
import transactionVerification from './transactionVerification';

import { Listener } from './subscribe';
import { Contracts } from './types';

interface Save {
  contracts: Contracts;
  store: any;
  listeners: Array<Listener>;
}

export default function save({
  contracts,
  store,
  listeners,
}: Save) {
  return (contractName: string) => {
    if (!contracts[contractName]) {
      throw Error(
        `Fatal error: The provided contract named as "${contractName}" could not be found in store contracts`
      );
    }

    return (data: any) => {
      const transactionStatus = transactionVerification({
        contract: { name: contractName, fields: contracts[contractName]},
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
