import dispatch from './dispatcher';

let __store__:any = {};
let __storeTree__: any = {};
let listeners: Array<Function | void> = [];

type ModelType = {
  name: string,
  fields: any
};

function mirrorStore(s: any) { return s }
function getStore() {
  return mirrorStore(__store__);
}

function subscribe(listener: Function) {
  if (typeof listener !== 'function') {
    throw Error('Expected listener to be a function');
  }
  return listeners.push(listener);
}

function createStore(models: Array<ModelType>) {
  if (JSON.stringify(__storeTree__) !== '{}') {
    throw Error('You can\'t create a store when it\'s already created.');
  }

  for (let m = 0; m < models.length; m++) {
    const current = models[m]
    const { fields = {} } = current;

    __storeTree__[current.name] = { ...fields };
  }

  return {
    dispatch,
    subscribe
  };
}

export {
  getStore,
  createStore
};

