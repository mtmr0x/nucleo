"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lawyer_1 = require("./lawyer");
function dispatch(contracts, store) {
    return (contractName) => {
        if (!contracts[contractName]) {
            throw Error(`The provided contract named as "${contractName}" could not be found in store contracts`);
        }
        return (data) => {
            return lawyer_1.default({ name: contractName, fields: contracts[contractName] }, data)(store);
        };
    };
}
exports.default = dispatch;
;
//# sourceMappingURL=dispatcher.js.map