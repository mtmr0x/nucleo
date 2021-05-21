export type Transaction = {
  ok: boolean;
}

// TODO: implement it to return from functions with more user friendly message
export function transaction<T>(ok: boolean, data: T) {
  return {
    ok,
    data
  };
}

