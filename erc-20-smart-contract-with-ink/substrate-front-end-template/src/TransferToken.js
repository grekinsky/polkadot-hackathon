import React, { useState } from 'react';
import { Form, Input, Grid, Button } from 'semantic-ui-react';
import useErc20Contract from './contracts/erc20/erc20.hooks';

export default function TransferToken({ accountPair }) {
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({ addressTo: null, amount: 0 });
  const { tokenContract, isLoading } = useErc20Contract();
  const { addressTo, amount } = formState;

  async function transfer() {
    if (!(addressTo && amount)) return;
    setStatus('Sending...');
    await tokenContract.transfer(accountPair, addressTo, amount, setStatus);
  }

  const onChange = (_, data) =>
    setFormState((prev) => ({ ...prev, [data.state]: data.value }));

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <Grid.Column width={8}>
      <h1>Transfer Token</h1>
      <Form>
        <Form.Field>
          Transfer more than the existential amount for account with 0 balance
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="To"
            type="text"
            placeholder="address"
            state="addressTo"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="Amount"
            type="number"
            state="amount"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <Button
            basic
            color={'blue'}
            type="submit"
            onClick={transfer}
            disabled={false}>
            {'Submit'}
          </Button>
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
