"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NucleoCustomPrimitive {
    serialize(value) {
        if (typeof value !== this.nativeType || this.formatValidation(value)) {
            return false;
        }
        return true;
    }
    formatValidation(value) {
        if (this.userFormatValidation) {
            return !this.userFormatValidation(value);
        }
        return false;
    }
}
class NucleoStringAssertion extends NucleoCustomPrimitive {
    constructor(userFormatValidation) {
        super();
        this.Type = 'NucleoString';
        this.nativeType = 'string';
        this.userFormatValidation = userFormatValidation;
    }
}
exports.NucleoStringAssertion = NucleoStringAssertion;
class NucleoNumberAssertion extends NucleoCustomPrimitive {
    constructor(userFormatValidation) {
        super();
        this.Type = 'NucleoNumber';
        this.nativeType = 'number';
        this.userFormatValidation = userFormatValidation;
    }
}
exports.NucleoNumberAssertion = NucleoNumberAssertion;
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