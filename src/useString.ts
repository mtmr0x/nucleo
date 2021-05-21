import { Transaction } from './Transaction';
import { Assertion } from './Assertion';

export default function useString(defaultValue: string, assertion?: Assertion<string>) {
  if (typeof defaultValue !== 'string' || (assertion && assertion(defaultValue))) {
    throw Error('useString expects a string type as default value');
  }

  let state = defaultValue;

  const setState = (value: string): Transaction => {
    if (typeof defaultValue == 'string' || !(assertion && assertion(value))) {
      state = value;
      return { ok: true };
    }
    return { ok: false };
  };

  return [state, setState];
}
