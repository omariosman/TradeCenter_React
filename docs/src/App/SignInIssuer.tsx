import React, { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";
import { Button, Form } from "semantic-ui-react";
import { useWeb3Context } from "../contexts/Web3";
import useAsync from "../components/useAsync";
import { signInIssuer } from "../api/TradeCenter";


interface SignInIssuerParams {
    web3: Web3;
    account: string;
  }
  
const SignInIssuer: React.FC = () => {
    const {
      state: { web3, account },
    } = useWeb3Context();
  
    const [input, setInput] = useState("");
    const { pending, call } = useAsync<SignInIssuerParams, void>(
      ({ web3, account }) => signInIssuer(web3,account)
    );
  
  async function handleClick(e){
      e.preventDefault();
      console.log("clicked!")
      //const web3 = Web3; 
      await signInIssuer(web3,account)
  
  }
  


  return (
    <Button secondary content="Sign In As Issuer" onClick={handleClick}  disabled={pending} loading={pending}></Button>
  );
};

export default SignInIssuer;
