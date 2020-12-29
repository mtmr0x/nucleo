import { Listener } from './subscribe';

const executeListeners = (modelName: string, listeners: Array<Listener>, data: any) => {
  for (let i = 0; i < listeners.length; i++) {
    if (listeners[i].on) {
      listeners[i].listener({ modelName, data });
    }
  }
};

export default executeListeners;
