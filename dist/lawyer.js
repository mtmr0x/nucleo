"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NucleoObject_1 = require("./nucleoTypes/NucleoObject");
const NucleoList_1 = require("./nucleoTypes/NucleoList");
function lawyer(contract, data) {
    const contractKeys = Object.keys(contract);
    const { fields: contractFields } = contract;
    const dataKeys = Object.keys(data);
    const contractName = contract.name;
    let __errors__ = [];
    // loop checking object values comparison
    for (let i = 0; dataKeys.length > i; i++) {
        const currentDataKey = data[dataKeys[i]];
        // recursion to call itself when is NucleoObject instance
        if (contractFields[dataKeys[i]] instanceof NucleoObject_1.default) {
            lawyer(contractFields[dataKeys[i]], currentDataKey);
            continue;
        }
        if (contractFields[dataKeys[i]] instanceof NucleoList_1.default) {
            console.log(contractFields[dataKeys[i]]);
        }
        if (!contractFields[dataKeys[i]]) {
            __errors__.push({
                contract: contractName,
                error: `${dataKeys[i]} is not in ${contractName} contract and can not be saved in store.`
            });
        }
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
    console.log('> lawyer errors', __errors__);
    // TODO: compare contract with received and every operation be a update, not a rewrite
    // TODO: actually it's not really necessary either. Side effects of programming late, right?
    return (store) => {
        return store[contractName] = data;
    };
}
exports.default = lawyer;
//# sourceMappingURL=lawyer.js.map