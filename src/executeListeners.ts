import { Listener } from './subscribe';

const executeListeners = (contractName: string, listeners: Array<Listener>, data: any) => {
  for (let i = 0; i < listeners.length; i++) {
    if (listeners[i].on) {
      listeners[i].listener({ contractName, data });
    }
  }
};

export default executeListeners;
