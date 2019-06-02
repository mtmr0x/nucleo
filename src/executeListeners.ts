const executeListeners = (contractName: string, listeners: Array<Function>, data: any) => {
  for (let i = 0; i < listeners.length; i++) {
    listeners[i]({ contractName, data });
  }
};

export default executeListeners;
