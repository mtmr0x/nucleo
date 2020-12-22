export type State = {
  [key: string]: string|number|boolean,
}

export interface Contracts {
  [key: string]: NucleoObjectType
}

export interface NucleoObjectType {
  name: string;
  fields: {
    [key: string]: any
  };
}

export class NucleoObject<T> implements NucleoObjectType {
  name: string;
  fields: { [key: string]: T };

  constructor(config: NucleoObjectType) {
    this.name = config.name;
    this.fields = config.fields;
  }

  getFields = () => this.fields
}

export interface SerializeFunction<T> {
  (value: T): boolean
}

export type NucleoPrimitiveType<T> = {
  Type: string,
  serialize: SerializeFunction<T>
};

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

// NucleoList
interface N<T> {
  name?: string;
  fields?: any;
  Type?: string;
  serialize?: SerializeFunction<T>;
}

export type NucleoListType = {
  getListChildrenType: () => string;
};

export class NucleoList<T> implements NucleoListType {
  NucleoObject: NucleoObjectType;
  NucleoPrimitive: N<T>;

  constructor(config: N<T>) {
    if (config instanceof NucleoObject) {
      this.NucleoObject = config;
    }
    this.NucleoPrimitive = { Type: config.Type, serialize: config.serialize };
  }

  getListChildrenType = ():string => {
    if (this.NucleoObject) {
      return 'NucleoObject';
    }
    return 'NucleoPrimitive';
  }
}
