// TODO: choose a better name for serialize, it doesn't fit perfectly
import { NucleoPrimitiveType } from './../_types/primitiveTypes';

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

