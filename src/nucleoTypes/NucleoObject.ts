import { NucleoObjectType } from './../_types/NucleoObjectType';

// TODO: validate the name and fields, anything else can be here beyond the expected
export default class NucleoObject {
  name: string;
  fields: any;

  constructor(config: NucleoObjectType) {
    this.name = config.name;
    this.fields = config.fields;
  }

  getFields = () => this.fields
}
