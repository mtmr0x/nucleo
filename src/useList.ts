import { Transaction } from './Transaction';

enum NucleoList {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  LIST = 'list',
  ANY = 'any',
}

function hasOwnProperty<X extends {}, Y extends PropertyKey> // eslint-disable-line
  (obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop); // eslint-disable-line
}

export default function useList<T>(t: NucleoList = NucleoList.ANY) {
  const state: Array<T> = [];

  const push = (value: T): Transaction => {
    if (value === null) {
      return { ok: false };
    }

    const _typeof = () => {
      if (t === NucleoList.ANY) {
        return NucleoList.ANY;
      } else if (typeof value === 'object') {
        return hasOwnProperty(value, 'length') ? NucleoList.LIST : NucleoList.OBJECT;
      }
      // now it's string, number or boolean
      return typeof value;
    };

    if (t === _typeof()) {
      state.push(value);
      return { ok: true }
    }

    return { ok: false };
  }

  const pop = (): Transaction => {
    state.pop();
    return { ok: true };
  }

  const shift = (): Transaction => {
    state.shift();
    return { ok: true };
  }

  return [
    state,
    push,
    pop,
    shift,
  ];
}
