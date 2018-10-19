"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const save_1 = require("./save");
const NucleoObject_1 = require("./nucleoTypes/NucleoObject");
let listeners = [];
function subscribe(listener) {
    if (typeof listener !== 'function') {
        throw Error('Expected listener to be a function');
    }
    return listeners.push(listener);
}
function getStore(store) {
    return () => {
        return store;
    };
}
function createStore(contracts) {
    let __store__ = {};
    let __contracts__ = {};
    if (JSON.stringify(__contracts__) !== '{}') {
        throw Error('You can\'t create a store when it\'s already created.');
    }
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
        dispatch: save_1.default({ contracts: __contracts__, store: __store__, listeners, saveMethod: 'dispatch' }),
        update: save_1.default({ contracts: __contracts__, store: __store__, listeners, saveMethod: 'update' }),
        subscribe,
        getStore: getStore(__store__)
    };
}
exports.createStore = createStore;
//# sourceMappingURL=store.js.map