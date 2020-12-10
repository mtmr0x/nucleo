export interface SerializeFunction<T> {
  (value: T): boolean
}

export type NucleoPrimitiveType<T> = {
  Type: string,
  serialize: SerializeFunction<T>
};
