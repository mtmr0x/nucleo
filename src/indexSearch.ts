import executeListeners from './executeListeners';
import { Listener } from './subscribe';

const saveType = (data:any):'rec'|'save' => {
  if (typeof data === 'object' && !Array.isArray(data)) {
    return 'rec';
  }

  return 'save';
};

interface IndexSearchInterface {
  contractName: string;
  storeData: any|{};
  data: any;
  listeners: Array<Listener>|void;
  newStoreData: any|{};
  newListenersData: any|{};
}

const indexSearch = (args: IndexSearchInterface) => {
  const {
    contractName,
    storeData = {},
    data,
    listeners,
    newStoreData = {},
    newListenersData = {}
  } = args;

  const storeDataKeys = Object.keys(storeData);

  for (let i = 0; storeDataKeys.length > i; i++) {
    const dataTypeReflection = () => ({
      rec: () => {
        const bufferData = data[storeDataKeys[i]] === null || data[storeDataKeys[i]] === undefined ? storeData[storeDataKeys[i]] : data[storeDataKeys[i]];
        newStoreData[storeDataKeys[i]] = {};
        newListenersData[storeDataKeys[i]] = {};

        return indexSearch({
          contractName: '',
          storeData: storeData[storeDataKeys[i]],
          data: bufferData,
          listeners: undefined,
          newStoreData: newStoreData[storeDataKeys[i]],
          newListenersData: newListenersData[storeDataKeys[i]]
        });
      },
      save: () => {
        const nonExistentValue = data[storeDataKeys[i]] === null || data[storeDataKeys[i]] === undefined ? true : false;
        if (!nonExistentValue) {
          newStoreData[storeDataKeys[i]] = data[storeDataKeys[i]];
          return newListenersData[storeDataKeys[i]] = data[storeDataKeys[i]];
        }
        newStoreData[storeDataKeys[i]] = storeData[storeDataKeys[i]];
        return newListenersData[storeDataKeys[i]] = storeData[storeDataKeys[i]];
      }
    });

    dataTypeReflection()[saveType(storeData[storeDataKeys[i]])]();
  }

  if (listeners && listeners.length) {
    executeListeners(contractName, listeners, newListenersData);
  }
  return newStoreData;
};

export default indexSearch;
