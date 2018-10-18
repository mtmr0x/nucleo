// TODO: choose a better name for serialize, it doesn't fit perfectly
import { NucleoPrimitiveType } from './../_types/NucleoPrimitiveType';

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

export const NucleoString: NucleoPrimitiveType = {
  Type: 'NucleoString',
  serialize: (value: string):boolean => {
    if (typeof value !== 'string') {
      return false;
    }

    return true;
  }
};

export const NucleoNumber: NucleoPrimitiveType = {
  Type: 'NucleoNumber',
  serialize: (value: number):boolean => {
    if (typeof value !== 'number') {
      return false;
    }

    return true;
  }
};

export const NucleoBoolean: NucleoPrimitiveType = {
  Type: 'NucleoBoolean',
  serialize: (value: boolean):boolean => {
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

