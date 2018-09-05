import NucleoObject from './nucleoTypes/NucleoObject';
import NucleoList from './nucleoTypes/NucleoList';

export default function lawyer(contract: any, data: any) {
  const contractKeys:Array<string> = Object.keys(contract);
  const { fields: contractFields }:any = contract;
  const dataKeys:Array<string> = Object.keys(data);
  const contractName:string = contract.name;
  let __errors__: Array<any> =  [];

  // loop checking object values comparison
  for (let i = 0; dataKeys.length > i; i++) {
    const currentDataKey = data[dataKeys[i]];
    // recursion to call itself when is NucleoObject instance
    if (contractFields[dataKeys[i]] instanceof NucleoObject) {
      lawyer(contractFields[dataKeys[i]], currentDataKey);
      continue;
    }

    if (contractFields[dataKeys[i]] instanceof NucleoList) {
      console.log(contractFields[dataKeys[i]]);
    }

    if (!contractFields[dataKeys[i]]) {
      __errors__.push({
        contract: contractName,
        error: `${dataKeys[i]} is not in ${contractName} contract and can not be saved in store.`
      });
    }

    if (contractFields[dataKeys[i]] && !contractFields[dataKeys[i]].serialize(currentDataKey)) {
      __errors__.push({
        contract: contractName,
        error: `${dataKeys[i]} field was expected as ${contractFields[dataKeys[i]].Type} but got ${typeof currentDataKey}`
      });
    }
  }

  if (__errors__.length) {
    throw Error(JSON.stringify({ errors: __errors__ }));
  }

  console.log('> lawyer errors', __errors__);

  // TODO: compare contract with received and every operation be a update, not a rewrite
  // TODO: actually it's not really necessary either. Side effects of programming late, right?
  return (store:any) => {
    return store[contractName] = data;
  }
}

