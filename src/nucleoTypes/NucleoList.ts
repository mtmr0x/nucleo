import { NucleoObjectType, Fields } from './../_types/NucleoObjectType';
import { NucleoListType } from './../_types/NucleoListType';

import NucleoObject from './../nucleoTypes/NucleoObject';

interface N {
  name?:string;
  fields?:any;
  Type?:string;
  serialize?:Function;
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
    // TODO: oh please, improve this shit
    if (this.NucleoObject) {
      return 'NucleoObject';
    }
    return 'NucleoPrimitive';
  }
}
