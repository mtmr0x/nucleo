"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
class NucleoList {
    constructor(config) {
        this._NucleoObject = { name: config.name, fields: config.fields };
        this._NucleoPrimitive = { Type: config.Type, serialize: config.serialize };
    }
}
exports.default = NucleoList;
//# sourceMappingURL=NucleoList.js.map