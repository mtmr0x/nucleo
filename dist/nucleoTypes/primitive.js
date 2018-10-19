"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// class NucleoCustomPrimitive {
//   Type: string;
//   userFormatValidation: Function|void;
//   nativeType: string;
//
//   serialize(value:string|number|boolean):boolean {
//     if (typeof value !== this.nativeType || this.formatValidation()) {
//       return false;
//     }
//     return true;
//   }
//
//   formatValidation():boolean {
//     if (this.userFormatValidation) {
//       return this.userFormatValidation();
//     }
//     return false;
//   }
// }
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
// export class NucleoString extends NucleoCustomPrimitive {
//   constructor(userFormatValidation:Function|void) {
//     super();
//     this.Type = 'NucleoString';
//     this.nativeType = 'string';
//     this.userFormatValidation = userFormatValidation;
//   }
// }
//
// export class NucleoNumber extends NucleoCustomPrimitive {
//   constructor(userFormatValidation:Function|void) {
//     super();
//     this.Type = 'NucleoNumber';
//     this.nativeType = 'number';
//     this.userFormatValidation = userFormatValidation;
//   }
// }
//
// export class NucleoBoolean extends NucleoCustomPrimitive {
//   constructor(userFormatValidation:Function|void) {
//     super();
//     this.Type = 'NucleoBoolean';
//     this.nativeType = 'boolean';
//     this.userFormatValidation = userFormatValidation;
//   }
// }
//# sourceMappingURL=primitive.js.map