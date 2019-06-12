"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const executeListeners_1 = require("./executeListeners");
const saveType = (data) => {
    if (typeof data === 'object' && !Array.isArray(data)) {
        return 'rec';
    }
    return 'save';
};
const indexSearch = (args) => {
    const { contractName, storeData = {}, data, listeners, newStoreData = {}, newListenersData = {} } = args;
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
        executeListeners_1.default(contractName, listeners, newListenersData);
    }
    return newStoreData;
};
exports.default = indexSearch;
//# sourceMappingURL=indexSearch.js.map