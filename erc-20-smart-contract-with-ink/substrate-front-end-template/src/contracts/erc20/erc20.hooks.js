import { useState, useEffect } from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import erc20Abi from './erc20.json';
import { useSubstrate } from '../../substrate-lib';
import TokenContract from './TokenContract';
import config from '../../config';

const contractAddress = config.CONTRACT_ADDRESS;

export default function useErc20Contract() {
  const { api } = useSubstrate();
  const [isLoading, setLoading] = useState(true);
  const [tokenContract, setTokenContract] = useState(null);

  useEffect(() => {
    if (!(api && contractAddress)) return;
    setLoading(true);
    const contractObject = new ContractPromise(api, erc20Abi, contractAddress);
    setTokenContract(new TokenContract(contractObject));
    setLoading(false);
  }, [api]);

  return { tokenContract, isLoading };
}
