// import { State } from './State';
import {
  NucleoPrimitiveType,
} from './NucleoPrimitiveType';
import { NucleoListType } from './NucleoListType';

export type Fields<T> = NucleoListType | NucleoPrimitiveType<T> | NucleoObjectType<Fields<T>>;

export interface NucleoObjectType<T> {
  name: string;
  fields: { [key: string]: T };
}
