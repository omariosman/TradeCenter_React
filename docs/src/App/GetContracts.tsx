import React, { useState } from "react";
import { useYieldOfferingWalletContext } from "../contexts/TradeCenter";
import DepositForm from "./AddOffering";
//import  VoteDead  from "./VoteDeadForm";
import CreateTxModal from "./CreateTxModal";
import TransactionList from "./TransactionList";
import  PingContractForm  from "./PingContract";
import   CheckDeadForm from "./CheckDeadStatus";
import { stat } from "fs";
import useAsync from "../components/useAsync";
import Web3 from "web3";
import BN from "bn.js";

import { buyOffering } from "../api/TradeCenter";
import { Button, Form } from "semantic-ui-react";

import { useWeb3Context } from "../contexts/Web3";


function GetContracts() {
  const { state } = useYieldOfferingWalletContext();

  return (
    <div>
          {console.log(state.contracts[0])}

        <table>
            <tr>
              <th>Contract ID</th>
              <th>Amount</th>
            </tr>
            {state.contracts.map(contract => 
              <tr>
                <td>{contract?.contractID}</td>
                <td>{contract?.amount}</td>

              </tr>
            )}
          </table>

    </div>
  );
}

export default GetContracts;
