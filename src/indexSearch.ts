const saveType = (data:any):'rec'|'save' => {
  if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
    return 'rec';
  }

  return 'save';
};

interface IndexSearch {
  storeData: any;
  data: any;
  updatedData?: any;
  clonedUpdatedData?: any;
}

/*
 * This function returns a tuple of exact same data but not with the same references.
 *
 * [updatedData, clonedUpdatedData]
 * updatedData -> is used to be saved in the store;
 * clonedUpdatedData -> is used to be sent to listeners;
 *
 * This is necessary because listeners are not under control of Nucleo and we must not send
 * them a reference to the data in the store.
 *
 */
export default function indexSearch(args: IndexSearch) {
  const {
    storeData = {},
    data,
    updatedData = {},
    clonedUpdatedData = {}
  } = args;

  const storeDataKeys = Object.keys(storeData);

  for (let i = 0; storeDataKeys.length > i; i++) {
    const dataTypeMapper = () => ({
      rec: () => {
        const bufferData = data[storeDataKeys[i]] === null || data[storeDataKeys[i]] === undefined ? storeData[storeDataKeys[i]] : data[storeDataKeys[i]];
        updatedData[storeDataKeys[i]] = {};
        clonedUpdatedData[storeDataKeys[i]] = {};

        return indexSearch({
          storeData: storeData[storeDataKeys[i]],
          data: bufferData,
          updatedData: updatedData[storeDataKeys[i]],
          clonedUpdatedData: clonedUpdatedData[storeDataKeys[i]]
        });
      },
      save: () => {
        const nonExistentValue = data[storeDataKeys[i]] === null || data[storeDataKeys[i]] === undefined ? true : false;
        if (!nonExistentValue) {
          updatedData[storeDataKeys[i]] = data[storeDataKeys[i]];
          return clonedUpdatedData[storeDataKeys[i]] = data[storeDataKeys[i]];
        }
        updatedData[storeDataKeys[i]] = storeData[storeDataKeys[i]];
        return clonedUpdatedData[storeDataKeys[i]] = storeData[storeDataKeys[i]];
      }
    });

    dataTypeMapper()[saveType(storeData[storeDataKeys[i]])]();
  }

  return [updatedData, clonedUpdatedData];
}

