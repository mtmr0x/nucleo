export type Listener = {
  index: number,
  listener: (arg: { modelName: string; data: any }) => void,
  on: boolean,
}

export const listeners: Listener[] = [];

export default function subscribe<T>(listener: (arg: { modelName: string; data: T }) => void):() => void {
  if (typeof listener !== 'function') {
    throw Error('Expected listener to be a function');
  }

  const index:number = listeners.length;

  const newListener:Listener = {
    index,
    listener,
    on: true,
  };

  listeners.push(newListener);

  return function unsubscribe() {
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i].index === index) {
        listeners[i].on = false;
      }
    }
  };
}

