import lawyer from './lawyer';

interface saveInterface {
  contracts: any;
  store: any;
  listeners: Array<Function>;
  saveMethod: 'update'|'dispatch'
}

export default function save({
  contracts,
  store,
  listeners,
  saveMethod
}:saveInterface) {
  return (contractName: string) => {
    if (!contracts[contractName]) {
      throw Error(
        `The provided contract named as "${contractName}" could not be found in store contracts`
      );
    }
    return (data: any) => {
      return lawyer({ name: contractName, fields: contracts[contractName]}, data, saveMethod)(store, listeners);
    };
  }
};

