import { NucleoObjectType } from './../_types/NucleoObjectType';

export default class NucleoObject<T> implements NucleoObjectType<T> {
  name: string;
  fields: { [key: string]: T };

  constructor(config: NucleoObjectType<T>) {
    this.name = config.name;
    this.fields = config.fields;
  }

  getFields = () => this.fields
}
