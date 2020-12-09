interface UpdateError {
  contract: string;
  error: string;
}

export interface Update<T> {
  status: '' | 'OK' | 'NOK';
  errors: UpdateError[];
  data: T;
}
