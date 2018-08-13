export const NucleoString = {
  Type: 'NucleoString',
  serialize: (value: string):string => {
    if (typeof value !== 'string') {
      throw Error(
        `Couldn't serialize value as string. Got ${typeof value}`
      );
    }

    return value;
  }
};

export const NucleoNumber = {
  Type: 'NucleoNumber',
  serialize: (value: number):number => {
    if (typeof value !== 'number') {
      throw Error(
        `Couldn't serialize value as number. Got ${typeof value}`
      );
    }

    return value;
  }
};

export const NucleoBoolean = {
  Type: 'NucleoBoolean',
  serialize: (value: boolean):boolean => {
    if (typeof value !== 'boolean') {
      throw Error(
        `Couldn't serialize value as boolean. Got ${typeof value}`
      );
    }

    return value;
  }
};

export const NucleoNull = null;
export const NucleoUndefined = undefined;

