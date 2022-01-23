import Web3 from "web3";
import BN from "bn.js";
import TruffleContract from "@truffle/contract";
import multiSigWalletTruffle from "../build/contracts/TODWallet.json";
import { AbiItem } from 'web3-utils'
//import Abi from './abi.json'
// @ts-ignore
const TODWallet = TruffleContract(multiSigWalletTruffle);

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
  owners: string[];
  hiers:string[];
  Confirmations: number;
  transactionCount: number;
  transactions: Transaction[];
  priceInUSD,
  votes
  
}

export async function get(web3: Web3, account: string): Promise<GetResponse> {
  TODWallet.setProvider(web3.currentProvider);

  const multiSig = await TODWallet.deployed();

  const balance = await web3.eth.getBalance(multiSig.address);
  const hiers = await multiSig.getHiers();
  const owners = await multiSig.getOwners();
  const votes = await multiSig.getReminder();
  console.log(votes)
  var test = await multiSig.getLatestPrice();
  console.log(test.toNumber())
  //console.log(hiers)
  //const ethprice = await multiSig.getLatestPrice();

/*const Web3 = require("web3") // for nodejs only
const newinstweb3 = new Web3("https://kovan.infura.io/v3/7f23025a1f0f4f119890bbed90ede571")
const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
const addr = "0x9326BFA02ADD2366b30bacB125260Af641031331"
const priceFeed = new newinstweb3.eth.Contract(aggregatorV3InterfaceABI as AbiItem[], addr)
const price = await priceFeed.methods.latestRoundData().call()
    .then((roundData) => {
        // Do something with roundData
        
        //console.log("Latest Round Data", roundData)
        return roundData;
    })*/
 const priceInUSD = test.toNumber() / 100000000
    //console.log([])

  //console.log(ethprice)

  //console.log(multiSig.address)
  //console.log(hiers);
 
  const Confirmations = await multiSig.Confirmations();
  const transactionCount = await multiSig.numberOfTransactionsGetter();

  // get 10 most recent tx
  const count = transactionCount.toNumber();
  const transactions: Transaction[] = [];
  for (let i = 1; i <= 10; i++) {
    const txIndex = count - i;
    if (txIndex < 0) {
      break;
    }

    const tx = await multiSig.TxGetter(txIndex);
    const isConfirmed = await multiSig.isConfirmed(txIndex, account);

    transactions.push({
      txIndex,
      to: tx.to,
      value: tx.value,
      data: tx.data,
      executed: tx.executed,
      numConfirmations: tx.numConfirmations.toNumber(),
      isConfirmedByCurrentAccount: isConfirmed,
    });
  }

  return {
    address: multiSig.address,
    balance,
    owners,
    hiers,
    Confirmations: Confirmations.toNumber(),
    transactionCount: count,
    transactions,
    priceInUSD,
    votes
    
  };
}

export async function deposit(
  web3: Web3,
  account: string,
  params: {
    value: BN;
  }
)

{
  TODWallet.setProvider(web3.currentProvider);
  const multiSig = await TODWallet.deployed();

  await multiSig.sendTransaction({ from: account, value: params.value });
}


export async function IamAllive(
  web3: Web3,
  account: string,

)

{
  TODWallet.setProvider(web3.currentProvider);
  const multiSig = await TODWallet.deployed();

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

  TODWallet.setProvider(web3.currentProvider);
  const multiSig = await TODWallet.deployed();

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

  TODWallet.setProvider(web3.currentProvider);
  const multiSig = await TODWallet.deployed();

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

  TODWallet.setProvider(web3.currentProvider);
  const multiSig = await TODWallet.deployed();

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

  TODWallet.setProvider(web3.currentProvider);
  const multiSig = await TODWallet.deployed();

  await multiSig.execTxFunc(txIndex, {
    from: account,
  });
}

export function subscribe(
  web3: Web3,
  address: string,
  callback: (error: Error | null, log: Log | null) => void
) {
  const multiSig = new web3.eth.Contract(TODWallet.abi, address);

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
  

  TODWallet.setProvider(web3.currentProvider);
  const multiSig = await TODWallet.deployed();
  await multiSig.OwnerIsDeceased({
    from: account,
  });
}


export async function IfOwnerDead(
  web3: Web3,
  account: string,
  
) {
  

  TODWallet.setProvider(web3.currentProvider);
  const multiSig = await TODWallet.deployed();
  await multiSig.IfOwnerDead({
    from: account,
  });
}






interface Deposit {
  event: "Deposit";
  returnValues: {
    sender: string;
    amount: string;
    balance: string;
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
