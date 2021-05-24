// NucleoModel
export interface NucleoModelFields {
  [key: string]: NucleoModel|NucleoList<any>|NucleoPrimitiveType<string|boolean|number>;
}

interface NucleoModelType {
  name: string;
  fields: NucleoModelFields;
  getListChildrenType?: () => string; // from lists
  serialize?: () => any;
}

export class NucleoModel implements NucleoModelType {
  name: string;
  fields: NucleoModelFields;
  getListChildrenType: () => string;
  serialize: () => any;

  constructor(config: NucleoModelType) {
    this.name = config.name;
    this.fields = config.fields;
  }
}

// Primitives
interface SerializeFunction<T> {
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
  fields: NucleoModelFields;
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
interface ListChild<T> {
  name?: string;
  fields?: any;
  Type?: string;
  serialize?: SerializeFunction<T>;
}

interface NucleoListType {
  getListChildrenType: () => string;
  name: string;
  fields: NucleoModelFields;
  serialize: () => any;
}

export class NucleoList<T> implements NucleoListType {
  NucleoModel: NucleoModelType;
  NucleoPrimitive: ListChild<T>;
  name: string;
  fields: NucleoModelFields;
  serialize: () => any;

  constructor(config: ListChild<T>) {
    if (config instanceof NucleoModel) {
      this.NucleoModel = config;
    }
    this.NucleoPrimitive = { Type: config.Type, serialize: config.serialize };
  }

  getListChildrenType = ():string => {
    if (this.NucleoModel) {
      return 'NucleoModel';
    }
    return 'NucleoPrimitive';
  }
}
