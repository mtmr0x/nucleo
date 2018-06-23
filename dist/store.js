"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let store = {};
let listeners = [];
function createState(name, state) {
    if (store[name]) {
        throw Error(`Object with ${name} name already exists in store`);
    }
    store[name] = state;
}
exports.createState = createState;
function getState() {
    return store;
}
exports.getState = getState;
function subscribe(listener) {
    return listeners.push(listener);
}
//# sourceMappingURL=store.js.map