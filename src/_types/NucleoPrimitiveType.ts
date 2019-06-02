interface SerializeFunction {
  (value: string|boolean|number): boolean
}

export type NucleoPrimitiveType = {
  Type: string,
  serialize: SerializeFunction
};
