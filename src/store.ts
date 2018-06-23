let store:any = {};
let listeners: Array<Function | void> = [];

function createState(name: string, state: any) {
  if (store[name]) {
    throw Error(`Object with ${name} name already exists in store`);
  }
  store[name] = state;
}

function getStore() {
  return store;
}

function subscribe(listener: Function) {
  if (typeof listener !== 'function') {
    throw Error('Expected listener to be a function');
  }
  return listeners.push(listener);
}

function createStore(initialState: any) {
  if (JSON.stringify(store) !== '{}') {
    throw Error('You can\'t create a store when it\'s already created.');
  }

  store = initialState;

  return {
    getStore,
    subscribe
  };
}


export { getStore, createState, createStore };

