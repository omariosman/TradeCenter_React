import React, { useState } from "react";
import { useYieldOfferingWalletContext } from "../contexts/TradeCenter";
import { Button } from "semantic-ui-react";
import DepositForm from "./AddOffering";
//import  VoteDead  from "./VoteDeadForm";
import CreateTxModal from "./CreateTxModal";
import TransactionList from "./TransactionList";
import VoteDeadForm from "./VoteDead";
import  PingContractForm  from "./PingContract";
import   CheckDeadForm from "./CheckDeadStatus";
import { stat } from "fs";

function YieldOfferingWallet() {
  const { state } = useYieldOfferingWalletContext();
  const [open, openModal] = useState(false);
  
  

  return (
    <div>

        <p><span className="badge badge-secondary">address:</span> {state.address}</p>
        <p><span className="badge badge-secondary">balance:</span> {state.balance}</p>

        <DepositForm />

    </div>
  );
}

export default YieldOfferingWallet;
