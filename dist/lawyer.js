"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NucleoObjectType_1 = require("./types/NucleoObjectType");
function lawyer(contract, data) {
    const contractKeys = Object.keys(contract);
    const { fields: contractFields } = contract;
    const dataKeys = Object.keys(data);
    const contractName = contract.name;
    let __errors__ = [];
    // loop checking object values comparison
    for (let i = 0; dataKeys.length > i; i++) {
        const currentDataKey = data[dataKeys[i]];
        // recursion to call itself when is NucleoObjectType instance
        console.log('currentDataKey', data[dataKeys[i]] instanceof NucleoObjectType_1.default);
        if (data[dataKeys[i]] instanceof NucleoObjectType_1.default) {
            console.log('TRUEZAO');
            lawyer(contract[dataKeys[i]], currentDataKey);
        }
        if (!contractFields[dataKeys[i]]) {
            __errors__.push({
                contract: contractName,
                error: `${dataKeys[i]} is not in ${contractName} contract and can not be saved in store.`
            });
        }
        console.log('contractFields', contractFields[dataKeys[i]]);
        if (contractFields[dataKeys[i]] && !contractFields[dataKeys[i]].serialize(currentDataKey)) {
            __errors__.push({
                contract: contractName,
                error: `${dataKeys[i]} field was expected as ${contractFields[dataKeys[i]].Type} but got ${typeof currentDataKey}`
            });
        }
    }
    if (__errors__.length) {
        throw Error(JSON.stringify({ errors: __errors__ }));
    }
    console.log('lawyer errors', __errors__);
    return (store) => {
        return store[contractName] = data;
    };
}
exports.default = lawyer;
//# sourceMappingURL=lawyer.js.map