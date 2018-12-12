"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NucleoFunction = {
    Type: 'NucleoFunction',
    serialize: (value) => {
        if (typeof value !== 'function') {
            return false;
        }
        return true;
    }
};
exports.default = NucleoFunction;
//# sourceMappingURL=NucleoFunction.js.map