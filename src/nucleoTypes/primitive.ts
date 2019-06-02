import { NucleoPrimitiveType } from './../_types/NucleoPrimitiveType';

class NucleoCustomPrimitive {
  Type: string;
  userFormatValidation: Function|void;
  nativeType: string;

  serialize(value:string|number):boolean {
    if (typeof value !== this.nativeType || this.formatValidation(value)) {
      return false;
    }
    return true;
  }

  formatValidation(value:string|number):boolean {
    if (this.userFormatValidation) {
      return !this.userFormatValidation(value);
    }
    return false;
  }
}

export class NucleoStringAssertion extends NucleoCustomPrimitive {
  constructor(userFormatValidation:Function|void) {
    super();
    this.Type = 'NucleoString';
    this.nativeType = 'string';
    this.userFormatValidation = userFormatValidation;
  }
}

export class NucleoNumberAssertion extends NucleoCustomPrimitive {
  constructor(userFormatValidation:Function|void) {
    super();
    this.Type = 'NucleoNumber';
    this.nativeType = 'number';
    this.userFormatValidation = userFormatValidation;
  }
}

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
