"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const executeListeners = (contractName, listeners, data) => {
    for (let i = 0; i < listeners.length; i++) {
        if (listeners[i].on) {
            listeners[i].listener({ contractName, data });
        }
    }
};
exports.default = executeListeners;
//# sourceMappingURL=executeListeners.js.map