import React, { useState } from "react";
import { useMultiSigWalletContext } from "../contexts/TODWallet";
import { Button } from "semantic-ui-react";
import DepositForm from "./DepositForm";
//import  VoteDead  from "./VoteDeadForm";
import CreateTxModal from "./CreateTxModal";
import TransactionList from "./TransactionList";
import VoteDeadForm from "./VoteDead";
import  PingContractForm  from "./PingContract";
import   CheckDeadForm from "./CheckDeadStatus";

function TODWallet() {
  const { state } = useMultiSigWalletContext();
  const [open, openModal] = useState(false);
  
  

  return (
    <div>
      <div>Contract: {state.address}</div>


      <h3>Wallet Details:  </h3>
      <h3>Balance: {state.balance.valueOf() / 1000000000000000000} ETH</h3>
      

      
      <h3>ETH/USD Rate: 
        {state.priceInUSD}</h3>


        <h3>Wallet Worth :
        {state.priceInUSD * (state.balance.valueOf() / 1000000000000000000)} USD</h3>
        


      <DepositForm />
      <hr></hr>
<br></br>
<br></br>
<br></br>

        <hr></hr>

        <h3>Dead Vote Status :
        {state.votes}</h3>
<PingContractForm/>
<hr></hr>
<br></br>



      
      <VoteDeadForm/>


      <CheckDeadForm/>

     
      <h3>Owners</h3>
      <ul>
        {state.owners.map((owner, i) => (
          <li key={i}>{owner}</li>
        ))}
      </ul>

      <h3>Hiers</h3>
      <ul>
        {state.hiers.map((hier, i) => (
          <li key={i}>{hier}</li>
        ))}
      </ul>

     





      <div>Confirmations required: {state.Confirmations}</div>
      <h3>Transactions ({state.transactionCount})</h3>
      <Button  onClick={() => openModal(true)}>
        Create Transaction
      </Button>
      {open && <CreateTxModal open={open} onClose={() => openModal(false)} />}
      <TransactionList
        Confirmations={state.Confirmations}
        data={state.transactions}
        count={state.transactionCount}
      />



    </div>
  );
}

export default TODWallet;
