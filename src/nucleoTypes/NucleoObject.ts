import { NucleoObjectType } from './../_types/NucleoObjectType';

export default class NucleoObject<T> implements NucleoObjectType {
  name: string;
  fields: { [key: string]: T };

  constructor(config: NucleoObjectType) {
    this.name = config.name;
    this.fields = config.fields;
  }

  getFields = () => this.fields
}
