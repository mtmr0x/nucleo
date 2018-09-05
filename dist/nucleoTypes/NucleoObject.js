"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: validate the name and fields, anything else can be here beyond the expected
class NucleoObject {
    constructor(config) {
        this.getFields = () => this.fields;
        this.name = config.name;
        this.fields = config.fields;
    }
}
exports.default = NucleoObject;
//# sourceMappingURL=NucleoObject.js.map