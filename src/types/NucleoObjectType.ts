type ObjectType = {
  name: string,
  fields: any
};

// TODO: validate the name and fields, anything else can be here beyond the expected
export default class {
  name: string;
  fields: any;

  constructor(config: ObjectType) {
    this.name = config.name;
    this.fields = config.fields;
  }

  getFields = () => this.fields
}

