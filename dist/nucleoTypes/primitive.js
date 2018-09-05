"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=primitive.js.map