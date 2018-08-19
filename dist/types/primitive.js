"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: choose a better name for serialize, it doesn't fit perfectly
exports.NucleoString = {
    Type: 'NucleoString',
    serialize: (value) => {
        if (typeof value !== 'string') {
            return false;
        }
        return true;
    }
};
exports.NucleoNumber = {
    Type: 'NucleoNumber',
    serialize: (value) => {
        if (typeof value !== 'number') {
            return false;
        }
        return true;
    }
};
exports.NucleoBoolean = {
    Type: 'NucleoBoolean',
    serialize: (value) => {
        if (typeof value !== 'boolean') {
            return false;
        }
        return true;
    }
};
exports.NucleoNull = null;
exports.NucleoUndefined = undefined;
//# sourceMappingURL=primitive.js.map