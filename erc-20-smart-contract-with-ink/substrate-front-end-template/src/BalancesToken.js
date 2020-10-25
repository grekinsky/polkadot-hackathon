import React, { useEffect, useState } from 'react';
import { Table, Grid, Button } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSubstrate } from './substrate-lib';
import useErc20Contract from './contracts/erc20/erc20.hooks';

export default function Main(props) {
  const { api, keyring } = useSubstrate();
  const accounts = keyring.getPairs();
  const [balances, setBalances] = useState([]);
  const { tokenContract } = useErc20Contract();

  useEffect(() => {
    if (!tokenContract) return;
    const addresses = keyring.getPairs().map((account) => account.address);
    let unsubscribeAll = null;

    async function init() {
      async function getBalances() {
        try {
          const balancesArray = await Promise.all(
            addresses.map((address) =>
              tokenContract.balanceOf(address, address),
            ),
          );
          setBalances(balancesArray);
        } catch (e) {
          console.error(e);
        }
      }

      await getBalances();

      unsubscribeAll = await api.rpc.chain.subscribeNewHeads(getBalances);
    }

    init();

    return () => unsubscribeAll && unsubscribeAll();
  }, [api, keyring, setBalances, tokenContract]);

  return (
    <Grid.Column>
      <h1>Balances</h1>
      <Table celled striped size="small">
        <Table.Body>
          {accounts.map((account, i) => (
            <Table.Row key={account.address}>
              <Table.Cell width={3} textAlign="right">
                {account.meta.name}
              </Table.Cell>
              <Table.Cell width={10}>
                <span style={{ display: 'inline-block', minWidth: '31em' }}>
                  {account.address}
                </span>
                <CopyToClipboard text={account.address}>
                  <Button
                    basic
                    circular
                    compact
                    size="mini"
                    color="blue"
                    icon="copy outline"
                  />
                </CopyToClipboard>
              </Table.Cell>
              <Table.Cell width={3}>{balances && balances[i]}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Grid.Column>
  );
}
