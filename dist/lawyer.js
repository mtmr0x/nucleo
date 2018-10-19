"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NucleoObject_1 = require("./nucleoTypes/NucleoObject");
const NucleoList_1 = require("./nucleoTypes/NucleoList");
const executeListeners = (contractName, listeners) => {
    for (let i = 0; i < listeners.length; i++) {
        listeners[i]({ contractName });
    }
};
const indexSearch = (contractData, data, newData = {}) => {
    const dataKeys = Object.keys(data);
    const contractDataKeys = Object.keys(contractData);
    for (let i = 0; contractDataKeys.length > i; i++) {
        // reflection for appending data to newData
        const dataTypeReflection = () => ({
            'object': () => {
                // if current data is object, recusirvely call indexSearch
                const bufferData = data[contractDataKeys[i]] || contractData[contractDataKeys[i]];
                newData[contractDataKeys[i]] = {};
                return indexSearch(contractData[contractDataKeys[i]], bufferData, newData[contractDataKeys[i]]);
            },
            'primitive': () => {
                if (data[contractDataKeys[i]]) {
                    return newData[contractDataKeys[i]] = data[contractDataKeys[i]];
                }
                return newData[contractDataKeys[i]] = contractData[contractDataKeys[i]];
            }
        });
        if (typeof contractData[contractDataKeys[i]] === 'object') {
            dataTypeReflection()['object']();
            continue;
        }
        dataTypeReflection()['primitive']();
    }
    return newData;
};
const saveMethodReflection = (store, contractName) => ({
    dispatch: (data) => {
        return store[contractName] = data;
    },
    update: (data) => {
        return store[contractName] = indexSearch(store[contractName], data);
    }
});
function lawyer({ contract, data, saveMethod, __errors__, }) {
    const { fields: contractFields } = contract;
    const dataKeys = Object.keys(data);
    const contractName = contract.name;
    if (dataKeys.length !== Object.keys(contractFields).length && saveMethod === 'dispatch') {
        throw Error(`Fatal error: In dispatch, the dispatched data and the contract must match in every level. For changing just few values from ${contractName} contract, use update() method.`);
    }
    // loop object values comparison
    for (let i = 0; dataKeys.length > i; i++) {
        const currentDataKey = data[dataKeys[i]];
        // REGION NucleoObject
        if (contractFields[dataKeys[i]] instanceof NucleoObject_1.default) {
            lawyer({
                contract: contractFields[dataKeys[i]],
                data: currentDataKey,
                saveMethod,
                __errors__
            });
            continue;
        }
        // END REGION NucleoObject
        // REGION NucleoList
        if ((contractFields[dataKeys[i]] instanceof NucleoList_1.default) && Array.isArray(currentDataKey)) {
            const _listItemType = contractFields[dataKeys[i]].getListChildrenType();
            const _NucleoItemType = contractFields[dataKeys[i]][_listItemType];
            const dataTypeReflection = () => ({
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
                    if (_NucleoItemType instanceof NucleoObject_1.default) {
                        for (let d = 0; d < currentDataKey.length; d++) {
                            lawyer({
                                contract: _NucleoItemType,
                                data: currentDataKey[d],
                                saveMethod,
                                __errors__
                            });
                        }
                    }
                },
            });
            dataTypeReflection()[_listItemType]();
            continue;
        }
        else if ((contractFields[dataKeys[i]] instanceof NucleoList_1.default) && !Array.isArray(currentDataKey)) {
            __errors__.push({
                contract: contractName,
                error: `NucleoList should receive data as list, but got ${typeof currentDataKey}`
            });
        }
        // END REGION NucleoList
        // REGION primitive types validation
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
        // END REGION primitive types validation
    }
    let operationStatus = '';
    if (__errors__.length) {
        operationStatus = 'NOK';
    }
    else {
        operationStatus = 'OK';
    }
    return (store, listeners) => {
        if (!__errors__.length) {
            executeListeners(contractName, listeners);
            saveMethodReflection(store, contractName)[saveMethod](data);
        }
        return {
            status: operationStatus,
            errors: __errors__,
            data,
        };
    };
}
exports.default = lawyer;
//# sourceMappingURL=lawyer.js.map