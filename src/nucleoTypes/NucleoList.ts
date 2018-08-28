import { NucleoObjectType } from './../_types/NucleoObjectType';
import { NucleoListType } from './../_types/NucleoListType';

export default class NucleoList {
  itemsType: string|number|boolean|NucleoObjectType;

  constructor(config: NucleoListType) {
    this.itemsType = config.itemsType;
  }
}

