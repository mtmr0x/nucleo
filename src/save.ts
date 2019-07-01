import lawyer from './lawyer';
import { Listener } from './subscribe';

interface saveInterface {
  contracts: any;
  store: any;
  listeners: Array<Listener>;
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
        `Fatal error: The provided contract named as "${contractName}" could not be found in store contracts`
      );
    }

    if (saveMethod === 'update' && !store[contractName]) {
      throw Error(
        `Fatal error: you can not update an item in store if it is not created yet.
        First use dispatch to save it and then you can perform updates at ${contractName} contract.`
      );
    }
    return (data: any) => {
      return lawyer({
        contract: { name: contractName, fields: contracts[contractName]},
        data,
        saveMethod,
        __errors__: []
      })(store, listeners);
    };
  };
}
