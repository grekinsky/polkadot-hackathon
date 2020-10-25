// NOTE the apps UI specified these in mega units
const gasLimit = 200000n * 1000000n;

export default class TokenContract {
  constructor(contract) {
    this._contract = contract;
  }

  async totalSupply(senderAddress) {
    try {
      const callValue = await this._contract.query.totalSupply(
        senderAddress,
        0, // value
        gasLimit,
      );

      // check if the call was successful
      if (callValue.result.isSuccess) {
        return callValue.output.toHuman();
      } else {
        console.error('Call failed');
        return 'Call failed';
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async balanceOf(senderAddress, owner) {
    try {
      const callValue = await this._contract.query.balanceOf(
        senderAddress,
        0, // value
        gasLimit,
        owner,
      );

      // check if the call was successful
      if (callValue.result.isSuccess) {
        return callValue.output.toHuman();
      } else {
        console.error('Call failed');
        return 'Error';
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async transfer(accountPair, addressTo, amount, setStatus) {
    try {
      await this._contract.tx
        .transfer(0, gasLimit, addressTo, parseInt(amount, 10))
        .signAndSend(accountPair, (result) => {
          if (result.status.isInBlock) {
            setStatus('In a block!');
          } else if (result.status.isFinalized) {
            setStatus('Finalized :-)');
          }
        });
    } catch (error) {
      console.error(error);
      setStatus(error.toString());
    }
  }
}
