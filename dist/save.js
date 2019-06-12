"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lawyer_1 = require("./lawyer");
function save({ contracts, store, listeners, saveMethod }) {
    return (contractName) => {
        if (!contracts[contractName]) {
            throw Error(`Fatal error: The provided contract named as "${contractName}" could not be found in store contracts`);
        }
        if (saveMethod === 'update' && !store[contractName]) {
            throw Error(`Fatal error: you can not update an item in store if it is not created yet.
        First use dispatch to save it and then you can perform updates at ${contractName} contract.`);
        }
        return (data) => {
            return lawyer_1.default({
                contract: { name: contractName, fields: contracts[contractName] },
                data,
                saveMethod,
                __errors__: []
            })(store, listeners);
        };
    };
}
exports.default = save;
//# sourceMappingURL=save.js.map