// NucleoObject
export interface NucleoObjectFields {
  [key: string]: NucleoObject|NucleoList<any>|NucleoPrimitiveType<string|boolean|number>;
}

export interface NucleoObjectType {
  name: string;
  fields: NucleoObjectFields;
  getListChildrenType?: () => string; // from lists
  serialize?: () => any;
}

export class NucleoObject implements NucleoObjectType {
  name: string;
  fields: NucleoObjectFields;
  getListChildrenType: () => string;
  serialize: () => any;

  constructor(config: NucleoObjectType) {
    this.name = config.name;
    this.fields = config.fields;
  }
}

// Primitives

export interface SerializeFunction<T> {
  (value: T): boolean
}

const PrimitiveExternalFields = {
  name: '',
  fields: {},
  getListChildrenType: () => '',
}

type NucleoPrimitiveType<T> = {
  Type: string;
  serialize: SerializeFunction<T>;
  name: string;
  fields: NucleoObjectFields;
  getListChildrenType: () => string; // from lists
};

type PrimitiveOptions<T> = {
  check?: (value: T) => boolean;
};

export const NucleoString = (options?: PrimitiveOptions<string>): NucleoPrimitiveType<string> => ({
  Type: 'NucleoString',
  serialize: (value: string):boolean => {
    if (typeof value !== 'string') {
      return false;
    }
    if (options && options.check) {
      return options.check(value);
    }

    return true;
  },
  ...PrimitiveExternalFields,
});

export const NucleoNumber = (options?: PrimitiveOptions<number>): NucleoPrimitiveType<number> => ({
  Type: 'NucleoNumber',
  serialize: (value: number):boolean => {
    if (typeof value !== 'number') {
      return false;
    }
    if (options && options.check) {
      return options.check(value);
    }

    return true;
  },
  ...PrimitiveExternalFields,
});

export const NucleoBoolean = (options?: PrimitiveOptions<boolean>): NucleoPrimitiveType<boolean> => ({
  Type: 'NucleoBoolean',
  serialize: (value: boolean):boolean => {
    if (typeof value !== 'boolean') {
      return false;
    }
    if (options && options.check) {
      return options.check(value);
    }

    return true;
  },
  ...PrimitiveExternalFields,
});

// NucleoList
interface N<T> {
  name?: string;
  fields?: any;
  Type?: string;
  serialize?: SerializeFunction<T>;
}

export type NucleoListType = {
  getListChildrenType: () => string;
  name: string;
  fields: NucleoObjectFields;
  serialize: () => any;
};

export class NucleoList<T> implements NucleoListType {
  NucleoObject: NucleoObjectType;
  NucleoPrimitive: N<T>;
  name: string;
  fields: NucleoObjectFields;
  serialize: () => any;

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
