import { NucleoPrimitiveType } from './../_types/NucleoPrimitiveType';

type UserFormatValidation<T> = (arg: T) => boolean;

export class NucleoCustomPrimitive<T> {
  Type: string;
  userFormatValidation: UserFormatValidation<T>;
  nativeType: string;

  serialize(value: T):boolean {
    if (typeof value !== 'boolean' && (typeof value !== this.nativeType || this.formatValidation(value))) {
      return false;
    }
    return true;
  }

  formatValidation(value: T):boolean {
    if (this.userFormatValidation) {
      return !this.userFormatValidation(value);
    }
    return false;
  }
}

export class NucleoStringAssertion<T> extends NucleoCustomPrimitive<T> {
  constructor(userFormatValidation:UserFormatValidation<T>) {
    super();
    this.Type = 'NucleoString';
    this.nativeType = 'string';
    this.userFormatValidation = userFormatValidation;
  }
}

export class NucleoNumberAssertion<T> extends NucleoCustomPrimitive<T> {
  constructor(userFormatValidation:UserFormatValidation<T>) {
    super();
    this.Type = 'NucleoNumber';
    this.nativeType = 'number';
    this.userFormatValidation = userFormatValidation;
  }
}

export const NucleoString: NucleoPrimitiveType<string> = {
  Type: 'NucleoString',
  serialize: (value: string):boolean => {
    if (typeof value !== 'string') {
      return false;
    }

    return true;
  }
};

export const NucleoNumber: NucleoPrimitiveType<number> = {
  Type: 'NucleoNumber',
  serialize: (value: number):boolean => {
    if (typeof value !== 'number') {
      return false;
    }

    return true;
  }
};

export const NucleoBoolean: NucleoPrimitiveType<boolean> = {
  Type: 'NucleoBoolean',
  serialize: (value: boolean):boolean => {
    if (typeof value !== 'boolean') {
      return false;
    }

    return true;
  }
};
