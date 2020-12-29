import indexSearch from './indexSearch';
import executeListeners from './executeListeners';
import transactionVerification from './transactionVerification';

import { Listener } from './subscribe';
import { NucleoObject } from './types';

interface Save {
  model: NucleoObject;
  state: any;
  listeners: Array<Listener>;
}

export default function save({
  model,
  state,
  listeners,
}: Save) {
  return (modelName: string) => {
    return (data: any) => {
      const transactionStatus = transactionVerification({
        model,
        data,
      });

      if (!transactionStatus.errors.length) {
        const [updatedData, clonedUpdatedData] = indexSearch({
          storeData: state[modelName],
          data,
        });

        state[modelName] = updatedData;

        if (listeners && listeners.length) {
          executeListeners(modelName, listeners, clonedUpdatedData);
        }
      }

      return transactionStatus;
    };
  };
}
