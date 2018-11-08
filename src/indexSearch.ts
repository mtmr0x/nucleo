import executeListeners from './executeListeners';

const saveType = (data:any):'rec'|'save' => {
  if (typeof data === 'object' && !data.length) {
    return 'rec';
  }

  return 'save';
};

interface IndexSearchInterface {
  contractName: string;
  storeData: any;
  data: any;
  listeners: Array<Function>|void;
  newStoreData: any;
  newListenerData: any;
};

const indexSearch = (args: IndexSearchInterface) => {
  const {
    contractName,
    storeData,
    data,
    listeners,
    newStoreData = {},
    newListenerData = {}
  } = args;

  const dataKeys = Object.keys(data);
  const storeDataKeys = Object.keys(storeData);

  for (let i = 0; storeDataKeys.length > i; i++) {
    const dataTypeReflection = () => ({
      rec: () => {
        const bufferData = data[storeDataKeys[i]] || storeData[storeDataKeys[i]];
        newStoreData[storeDataKeys[i]] = {};
        newListenerData[storeDataKeys[i]] = {};

        return indexSearch({
          contractName: '',
          storeData: storeData[storeDataKeys[i]],
          data: bufferData,
          listeners: undefined,
          newStoreData: newStoreData[storeDataKeys[i]],
          newListenerData: newListenerData[storeDataKeys[i]]
        });
      },
      save: () => {
        if (data[storeDataKeys[i]]) {
          newStoreData[storeDataKeys[i]] = data[storeDataKeys[i]];
          return newListenerData[storeDataKeys[i]] = data[storeDataKeys[i]];
        }
        newStoreData[storeDataKeys[i]] = storeData[storeDataKeys[i]];
        return newListenerData[storeDataKeys[i]] = storeData[storeDataKeys[i]];
      }
    });

    dataTypeReflection()[saveType(storeData[storeDataKeys[i]])]();
  }

  if (listeners && listeners.length) {
    executeListeners(contractName, listeners, newListenerData);
  }
  return newStoreData;
}

export default indexSearch;

