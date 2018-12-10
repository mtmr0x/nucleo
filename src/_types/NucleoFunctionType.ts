interface SerializeFunction {
  (value: Function): boolean
}

export type NucleoFunctionType = {
  Type: string,
  serialize: SerializeFunction
};
