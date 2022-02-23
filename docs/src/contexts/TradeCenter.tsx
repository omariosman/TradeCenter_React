import Web3 from "web3";
import BN from "bn.js";
import { AbiItem } from 'web3-utils'
import React, {
  useReducer,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react";
import { useWeb3Context } from "./Web3";
import { get as getYieldOfferingWallet, subscribe } from "../api/TradeCenter";





interface State {
  address: string;
  balance: any;
  offering: any[];
  contracts: any[]

}


interface Contract {
    buyer: BN;
    issuer: BN;
    amount: BN;
    offeringID: BN;
    contractID: BN;
  
  }

interface Offering {
    issuer: BN;
     ID: BN;
     name: string;
     Nb_fixings: BN;
     fixing_counter: BN;
     high_coupon: BN;
     high_coupon_barrier: BN;
     smaller_coupon: BN;
     Upoutbarrier: BN;
     di_barrier: BN;
    Di_barrier_activated: boolean;
    contractList: Contract[];
   }
   

interface Transaction {
  txIndex: number;
  to: string;
  value: BN;
  data: string;
  executed: boolean;
  numConfirmations: number;
  isConfirmedByCurrentAccount: boolean;
}

const INITIAL_STATE: State = {
  address: "",
  balance: "20",
  offering: [], //this takes value
  contracts: []

};

const SET = "SET";
const UPDATE_BALANCE = "UPDATE_BALANCE";


interface Set {
  type: "SET";
  data: {
    address: string;
    balance: any;
    offering: any[]; //this takes type
    contracts: any[];

  };
}

interface UpdateBalance {
  type: "UPDATE_BALANCE";
  data: {
    balance: string;
  };
}


type Action = Set | UpdateBalance;

function reducer(state: State = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case SET:
        return {
            ...state, //return the current state
            ...action.data //overwrite any changed field from this new data
        }
    default:
        return state;
  }
}

interface SetInputs {
  address: string;
  balance: string;
  offering: any[]; //this takes type
  contracts: any[];
}

interface UpdateBalanceInputs {
  balance: string;
}


const YieldOfferingWalletContext = createContext({
  state: INITIAL_STATE,
  set: (_data: SetInputs) => {},
  updateBalance: (_data: UpdateBalanceInputs) => {},

});

export function useYieldOfferingWalletContext() {
  return useContext(YieldOfferingWalletContext);
}

interface ProviderProps {}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  function set(data: SetInputs) {
      //this dispatch will execute the reducer
      //This object insdie dispatch is called action
    dispatch({
      type: SET,
      data,
    });
  }

  function updateBalance(data: UpdateBalanceInputs) {
    dispatch({
      type: UPDATE_BALANCE,
      data,
    });
  }



  return (
    <YieldOfferingWalletContext.Provider
      value={useMemo(
        () => ({
          state,
          set,
          updateBalance,
    
        }),
        [state]
      )}
    >
      {children}
    </YieldOfferingWalletContext.Provider>
  );
};

export function Updater() {
  /*
    we want to get the data from the contract and pass it to the reeducer
    before we get the data, we need to get the web3 and account object

  */
    const {
        state: {web3, account},
    } = useWeb3Context();


    const {state, set} = useYieldOfferingWalletContext();

    //we will use this function to get the data from the wallet contract
    //then call set to update our state
    //
    useEffect(() => {
        async function get(web3: Web3, account: string){    
        try {
            const data = await getYieldOfferingWallet(web3, account);
            set(data); //set will dispatch an action to set state with the new data
        } catch(error) {
            console.log(error)
        }
    }
    if (web3) {
        get(web3, account);
    }
    }, [web3])


    return null;
}
