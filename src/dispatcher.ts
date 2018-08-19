import lawyer from './lawyer';

export default function dispatch(contracts: any) {
  return (contractName: string) => {
    if (!contracts[contractName]) {
      throw Error(
        `The provided contract named as "${contractName}" could not be found in store contracts`
      );
    }
    return (data: any) => {
      return lawyer({ name: contractName, fields: contracts[contractName]}, data);
    };
  }
};

