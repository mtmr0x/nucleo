const saveType = (data:any):'rec'|'save' => {
  if (typeof data === 'object' && !data.length) {
    return 'rec';
  }

  return 'save';
};

const indexSearch = (storeData: any, data: any, newData:any = {}) => {
  const dataKeys = Object.keys(data);
  const storeDataKeys = Object.keys(storeData);

  for (let i = 0; storeDataKeys.length > i; i++) {
    const dataTypeReflection = () => ({
      'rec': () => {
        const bufferData = data[storeDataKeys[i]] || storeData[storeDataKeys[i]];
        newData[storeDataKeys[i]] = {}
        return indexSearch(storeData[storeDataKeys[i]], bufferData, newData[storeDataKeys[i]]);
      },
      'save': () => {
        if (data[storeDataKeys[i]]) {
          return newData[storeDataKeys[i]] = data[storeDataKeys[i]];
        }
        return newData[storeDataKeys[i]] = storeData[storeDataKeys[i]];
      }
    });

    dataTypeReflection()[saveType(storeData[storeDataKeys[i]])]();
  }

  return newData;
}

export default indexSearch;

