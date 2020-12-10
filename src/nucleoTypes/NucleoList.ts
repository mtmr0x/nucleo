import { NucleoObjectType } from './../_types/NucleoObjectType';
import { NucleoListType } from './../_types/NucleoListType';
import { SerializeFunction } from './../_types/NucleoPrimitiveType';

import NucleoObject from './../nucleoTypes/NucleoObject';

interface N<T> {
  name?: string;
  fields?: any;
  Type?: string;
  serialize?: SerializeFunction<T>;
}

export default class NucleoList<T> implements NucleoListType {
  NucleoObject: NucleoObjectType<T>;
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
