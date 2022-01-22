import React from "react";
import { Button } from "semantic-ui-react";
import { useWeb3Context } from "../contexts/Web3";
import useAsync from "../components/useAsync";
import * as multiSig from "../api/TODWallet";

interface Props {
  Confirmations: number;
  tx: {
    txIndex: number;
    executed: boolean;
    numConfirmations: number;
    isConfirmedByCurrentAccount: boolean;
  };
}

const TransactionActions: React.FC<Props> = ({
  Confirmations,
  tx,
}) => {
  const {
    state: { web3, account },
  } = useWeb3Context();

  const { txIndex } = tx;

  const confirmTx = useAsync(async () => {
    if (!web3) {
      throw new Error("No web3");
    }

    await multiSig.confirmTx(web3, account, { txIndex });
  });

  const removeConfirmationFunc = useAsync(async () => {
    if (!web3) {
      throw new Error("No web3");
    }

    await multiSig.removeConfirmationFunc(web3, account, { txIndex });
  });

  const executeTx = useAsync(async () => {
    if (!web3) {
      throw new Error("No web3");
    }

    await multiSig.executeTx(web3, account, { txIndex });
  });

  if (tx.executed) {
    return null;
  }
  return (
    <>
      {tx.isConfirmedByCurrentAccount ? (
        <Button
          onClick={(_e) => removeConfirmationFunc.call(null)}
          disabled={removeConfirmationFunc.pending}
          loading={removeConfirmationFunc.pending}
        >
          Revoke Confirmation
        </Button>
      ) : (
        <Button
          onClick={(_e) => confirmTx.call(null)}
          disabled={confirmTx.pending}
          loading={confirmTx.pending}
        >
          Confirm
        </Button>
      )}
      {tx.numConfirmations >= Confirmations && (
        <Button
          onClick={(_e) => executeTx.call(null)}
          disabled={executeTx.pending}
          loading={executeTx.pending}
        >
          Execute
        </Button>
      )}
    </>
  );
};

export default TransactionActions;
