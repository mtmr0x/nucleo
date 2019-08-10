"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listeners = [];
function subscribe(listener) {
    if (typeof listener !== 'function') {
        throw Error('Expected listener to be a function');
    }
    const index = exports.listeners.length;
    const newListener = {
        index,
        listener,
        on: true,
    };
    exports.listeners.push(newListener);
    return function unsubscribe() {
        for (let i = 0; i < exports.listeners.length; i++) {
            if (exports.listeners[i].index === index) {
                exports.listeners[i].on = false;
            }
        }
    };
}
exports.default = subscribe;
//# sourceMappingURL=subscribe.js.map