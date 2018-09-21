import { NucleoObjectType } from './../_types/NucleoObjectType';
import { NucleoListType } from './../_types/NucleoListType';
import { NucleoPrimitiveType } from './../_types/NucleoPrimitiveType';

interface N {
  name?:string;
  fields?: any;
  Type?:string;
  serialize?:Function;
};

export default class NucleoList {
  NucleoObject: N;
  NucleoPrimitive: N;

  constructor(config: N) {
    this.NucleoObject = { name: config.name, fields: config.fields };
    this.NucleoPrimitive = { Type: config.Type, serialize: config.serialize }
  }

  getListChildrenType = ():string => {
    if (this.NucleoObject.name) {
      return 'NucleoObject';
    }
    return 'NucleoPrimitive';
  }
}

