"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const save_1 = require("./save");
const NucleoObject_1 = require("./nucleoTypes/NucleoObject");
const indexSearch_1 = require("./indexSearch");
const subscribe_1 = require("./subscribe");
function createStore(contracts) {
    const __store__ = {};
    let __contracts__ = {};
    const contractsKeys = Object.keys(contracts);
    for (let c = 0; c < contractsKeys.length; c++) {
        const current = contracts[contractsKeys[c]];
        if (!(current instanceof NucleoObject_1.default)) {
            throw Error(`Each contract must be instances of NucleoObject. Received ${JSON.stringify(current)}.\nTo understand more, check the documentation about creating a contract in Nucleo here: https://github.com/mtmr0x/nucleo`);
        }
        const { fields = {} } = current;
        if (__contracts__[current.name]) {
            __contracts__ = {};
            throw Error(`Two contracts can not have the same name. Received more than one ${current.name} contract`);
        }
        __contracts__[current.name] = Object.assign({}, fields);
    }
    return {
        dispatch: save_1.default({ contracts: __contracts__, store: __store__, listeners: subscribe_1.listeners, saveMethod: 'dispatch' }),
        update: save_1.default({ contracts: __contracts__, store: __store__, listeners: subscribe_1.listeners, saveMethod: 'update' }),
        subscribe: subscribe_1.default,
        cloneState: (contractName) => {
            if (!__contracts__[contractName]) {
                return undefined;
            }
            return indexSearch_1.default({
                contractName,
                storeData: __store__[contractName],
                data: {},
                listeners: undefined,
                newStoreData: {},
                newListenersData: {}
            });
        }
    };
}
exports.createStore = createStore;
//# sourceMappingURL=store.js.map