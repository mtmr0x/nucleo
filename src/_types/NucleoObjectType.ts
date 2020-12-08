// import { State } from './State';
import { NucleoPrimitiveType } from './NucleoPrimitiveType';
import { NucleoListType } from './NucleoListType';

export type Fields = NucleoListType | NucleoPrimitiveType | NucleoObjectType<Fields>;

export interface NucleoObjectType<T extends Fields> {
  name: string;
  fields: { [key: string]: T };
}
