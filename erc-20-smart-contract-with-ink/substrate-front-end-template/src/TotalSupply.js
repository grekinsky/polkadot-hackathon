import React, { useEffect, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import useErc20Contract from './contracts/erc20/erc20.hooks';

export default function TotalSupply({ accountPair }) {
  const { tokenContract, isLoading } = useErc20Contract();
  const [totalSupply, setTotalSupply] = useState('');

  useEffect(() => {
    if (isLoading) return;
    async function init() {
      setTotalSupply(await tokenContract.totalSupply(accountPair.address));
    }
    init();
  }, [isLoading, setTotalSupply, accountPair, tokenContract]);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <Grid.Column width={16}>
      <h1>Total Suppy</h1>
      <p>{totalSupply}</p>
    </Grid.Column>
  );
}
