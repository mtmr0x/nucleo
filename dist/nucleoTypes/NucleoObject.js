"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NucleoObject {
    constructor(config) {
        this.getFields = () => this.fields;
        this.name = config.name;
        this.fields = config.fields;
    }
}
exports.default = NucleoObject;
//# sourceMappingURL=NucleoObject.js.map