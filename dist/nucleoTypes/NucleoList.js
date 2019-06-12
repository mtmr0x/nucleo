"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NucleoObject_1 = require("./../nucleoTypes/NucleoObject");
class NucleoList {
    constructor(config) {
        this.getListChildrenType = () => {
            // TODO: oh please, improve this shit
            if (this.NucleoObject) {
                return 'NucleoObject';
            }
            return 'NucleoPrimitive';
        };
        if (config instanceof NucleoObject_1.default) {
            this.NucleoObject = config;
        }
        this.NucleoPrimitive = { Type: config.Type, serialize: config.serialize };
    }
}
exports.default = NucleoList;
//# sourceMappingURL=NucleoList.js.map