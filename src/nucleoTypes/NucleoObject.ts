import { NucleoObjectType, Fields } from './../_types/NucleoObjectType';

export default class NucleoObject implements NucleoObjectType<Fields> {
  name: string;
  fields: any;

  constructor(config: NucleoObjectType<Fields>) {
    this.name = config.name;
    this.fields = config.fields;
  }

  getFields = () => this.fields
}
