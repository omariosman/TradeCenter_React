import Web3 from "web3";
import BN from "bn.js";
import TruffleContract from "@truffle/contract";
import YieldOfferings from "../build/contracts/YieldOfferings.json";
import { AbiItem } from 'web3-utils'
//import Abi from './abi.json'
// @ts-ignore
const YieldOfferingWallet = TruffleContract(YieldOfferings);

interface Transaction {
  txIndex: number;
  to: string;
  value: BN;
  data: string;
  executed: boolean;
  numConfirmations: number;
  isConfirmedByCurrentAccount: boolean;
}

interface GetResponse {
  address: string;
  balance: any;

}

export async function get(web3: Web3, account: string): Promise<GetResponse> {
    YieldOfferingWallet.setProvider(web3.currentProvider);
    const yieldOffering = await YieldOfferingWallet.deployed();

    const balance = await web3.eth.getBalance(yieldOffering.address)

    return {
        address: yieldOffering.address,
        balance: balance
    };

}

export async function deposit(
  web3: Web3,
  account: string,
  params: {
    offering_name:string,
    no_fixings: BN,
    high_coupon: BN ,
    high_coupon_barrier: BN ,
    smaller_coupon : BN,
    up_out_barrier: BN,
    di_barrier : BN 
  }
)



{
  YieldOfferingWallet.setProvider(web3.currentProvider);
  const yieldOffering = await YieldOfferingWallet.deployed();

  await yieldOffering.addOffering( params.offering_name,params.no_fixings, params.high_coupon, params.high_coupon_barrier,  params.smaller_coupon, params.up_out_barrier ,  params.di_barrier, {from: account});
}


/*
START Sign In Issuer
*/ 


export async function signInIssuer(
  web3: Web3,
  account: string,

)

{
  YieldOfferingWallet.setProvider(web3.currentProvider);
  const yieldOffering = await YieldOfferingWallet.deployed();
  await yieldOffering.SignInIssuer({from: account});
}

/*
END Sign In Issuer
*/ 





export async function IamAllive(
  web3: Web3,
  account: string,

)

{
  YieldOfferingWallet.setProvider(web3.currentProvider);
  const multiSig = await YieldOfferingWallet.deployed();

  await multiSig.IamAllive({ from: account });
}




export async function submitTx(
  web3: Web3,
  account: string,
  params: {
    to: string;
    // NOTE: error when passing BN type, so pass string
    value: string;
    data: string;
  }
) {
  const { to, value, data } = params;

  YieldOfferingWallet.setProvider(web3.currentProvider);
  const multiSig = await YieldOfferingWallet.deployed();

  await multiSig.requestTxFunc(to, value, data, {
    from: account,
  });
}

export async function confirmTx(
  web3: Web3,
  account: string,
  params: {
    txIndex: number;
  }
) {
  const { txIndex } = params;

  YieldOfferingWallet.setProvider(web3.currentProvider);
  const multiSig = await YieldOfferingWallet.deployed();

  await multiSig.approveTxFunc(txIndex, {
    from: account,
  });
}

export async function removeConfirmationFunc(
  web3: Web3,
  account: string,
  params: {
    txIndex: number;
  }
) {
  const { txIndex } = params;

  YieldOfferingWallet.setProvider(web3.currentProvider);
  const multiSig = await YieldOfferingWallet.deployed();

  await multiSig.removeConfirmationFunc(txIndex, {
    from: account,
  });
}

export async function executeTx(
  web3: Web3,
  account: string,
  params: {
    txIndex: number;
  }
) {
 
  const { txIndex } = params;

  YieldOfferingWallet.setProvider(web3.currentProvider);
  const multiSig = await YieldOfferingWallet.deployed();

  await multiSig.execTxFunc(txIndex, {
    from: account,
  });
}

export function subscribe(
  web3: Web3,
  address: string,
  callback: (error: Error | null, log: Log | null) => void
) {
  const multiSig = new web3.eth.Contract(YieldOfferingWallet.abi, address);

  const res = multiSig.events.allEvents((error: Error, log: Log) => {
    if (error) {
      callback(error, null);
    } else if (log) {
      callback(null, log);
    }
  });

  return () => res.unsubscribe();
}

export async function VoteDead(
  web3: Web3,
  account: string,
  
) {
  

  YieldOfferingWallet.setProvider(web3.currentProvider);
  const multiSig = await YieldOfferingWallet.deployed();
  await multiSig.OwnerIsDeceased({
    from: account,
  });
}


export async function IfOwnerDead(
  web3: Web3,
  account: string,
  
) {
  

  YieldOfferingWallet.setProvider(web3.currentProvider);
  const multiSig = await YieldOfferingWallet.deployed();
  await multiSig.IfOwnerDead({
    from: account,
  });
}






interface Deposit {
  event: "Deposit";
  returnValues: {
    offering_name:string,
    no_fixings: BN,
    high_coupon: BN ,
    high_coupon_barrier: BN ,
    smaller_coupon : BN,
    up_out_barrier: BN,
    di_barrier : BN 

  };
}

interface requestTx {
  event: "requestTx";
  returnValues: {
    owner: string;
    txIndex: string;
    to: string;
    value: string;
    data: string;
  };
}

interface approveTx {
  event: "approveTx";
  returnValues: {
    owner: string;
    txIndex: string;
  };
}

interface removeConfirmation {
  event: "removeConfirmation";
  returnValues: {
    owner: string;
    txIndex: string;
  };
}


interface execTx {
  event: "execTx";
  returnValues: {
    owner: string;
    txIndex: string;
  };
}


type Log =
  | Deposit
  | requestTx
  | approveTx
  | removeConfirmation
  | execTx;
