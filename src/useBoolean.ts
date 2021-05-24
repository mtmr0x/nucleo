import { Transaction } from './Transaction';

export default function useBoolean(defaultValue: boolean) {
  if (typeof defaultValue !== 'boolean') {
    throw Error('useBoolean expects a boolean type as default value');
  }

  let state = defaultValue;

  const setState = (value: boolean): Transaction => {
    if (typeof defaultValue == 'boolean') {
      state = value;
      return { ok: true };
    }
    return { ok: false };
  };

  return [state, setState];
}
