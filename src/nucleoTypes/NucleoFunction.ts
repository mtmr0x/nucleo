import { NucleoFunctionType } from './../_types/NucleoFunctionType';

const NucleoFunction: NucleoFunctionType = {
  Type: 'NucleoFunction',
  serialize: (value: Function):boolean => {
    if (typeof value !== 'function') {
      return false;
    }

    return true;
  }
};

export default NucleoFunction;
