import { Transaction } from './Transaction';
import { Assertion } from './Assertion';

export default function useNumber(defaultValue: number, assertion?: Assertion<number>) {
  if (typeof defaultValue !== 'number' || (assertion && assertion(defaultValue))) {
    throw Error('useNumber expects a number type as default value');
  }

  let state = defaultValue;

  const setState = (value: number): Transaction => {
    if (typeof defaultValue == 'number' || !(assertion && assertion(value))) {
      state = value;
      return { ok: true };
    }
    return { ok: false };
  };

  return [state, setState];
}
