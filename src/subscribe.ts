export type Listener = {
  index: number,
  listener: Function,
  on: boolean,
}
export const listeners: Array<Listener> = [];

export default function subscribe(listener: Function):Function {
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

