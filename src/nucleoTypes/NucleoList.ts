import { NucleoObjectType, Fields } from './../_types/NucleoObjectType';
import { NucleoListType } from './../_types/NucleoListType';
import { SerializeFunction } from './../_types/NucleoPrimitiveType';

import NucleoObject from './../nucleoTypes/NucleoObject';

interface N {
  name?: string;
  fields?: any;
  Type?: string;
  serialize?: SerializeFunction;
}

export default class NucleoList implements NucleoListType {
  NucleoObject: NucleoObjectType<Fields>;
  NucleoPrimitive: N;

  constructor(config: N) {
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
