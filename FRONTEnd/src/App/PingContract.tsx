import React, { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";
import { Button, Form } from "semantic-ui-react";
import { useWeb3Context } from "../contexts/Web3";
import useAsync from "../components/useAsync";
import { IamAllive } from "../api/TODWallet";

interface PingContractParams {
  web3: Web3;
  account: string;
}

const PingContractForm: React.FC = () => {
  const {
    state: { web3, account },
  } = useWeb3Context();

  const [input, setInput] = useState("");
  const { pending, call } = useAsync<PingContractParams, void>(
    ({ web3, account }) => IamAllive(web3,account)
  );

async function handleClick(e){
    e.preventDefault();
    console.log("clicked!")
    //const web3 = Web3; 
    await IamAllive(web3,account)

}

  

  return (
   
     
      <Button onClick={handleClick}   disabled={pending} loading={pending}>
        Ping Wallet (effective for owner only)
      </Button>
  
  );
};

export default PingContractForm;
