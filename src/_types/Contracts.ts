import { NucleoObjectType } from './NucleoObjectType';

export interface Contracts<S> {
  [key: string]: NucleoObjectType<S>
}

