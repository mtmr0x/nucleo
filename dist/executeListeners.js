"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const executeListeners = (contractName, listeners, data) => {
    for (let i = 0; i < listeners.length; i++) {
        listeners[i]({ contractName, data });
    }
};
exports.default = executeListeners;
//# sourceMappingURL=executeListeners.js.map