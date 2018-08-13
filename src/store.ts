let store:any = {};
let listeners: Array<Function | void> = [];

type ModelType = {
  name: string,
  fields: any
};

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

function createStore(models: Array<ModelType>) {
  if (JSON.stringify(store) !== '{}') {
    throw Error('You can\'t create a store when it\'s already created.');
  }
  let storeTree: any = {};

  console.log('models', models);
  for (let m = 0; m < models.length; m++) {
    const current = models[m]
    console.log('current', current);
    const { fields = {} } = current;

    storeTree[current.name] = { ...fields };
  }

  console.log('aqui', storeTree);

  // return (preloadedState: any) => {
  //   return console.log(preloadedState);
  // }
}


export { getStore, createState, createStore };

