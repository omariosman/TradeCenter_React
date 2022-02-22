import React, { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";
import { Button, Form } from "semantic-ui-react";
import { useWeb3Context } from "../contexts/Web3";
import useAsync from "../components/useAsync";
import { deposit } from "../api/TradeCenter";

interface Props {}

interface DepositParams {
  web3: Web3;
  account: string;
  params_obj:{
  offering_name:string,
  no_fixings: BN,
  high_coupon: BN ,
  high_coupon_barrier: BN ,
  smaller_coupon : BN,
  up_out_barrier: BN,
  di_barrier : BN 
    }
}
const DepositForm: React.FC<Props> = () => {
  const {
    state: { web3, account },
  } = useWeb3Context();

  const [inputs, setInput] = useState({offering_name: "", no_fixings: "", high_coupon: "", high_coupon_barrier: "", smaller_coupon: "", up_out_barrier: "", di_barrier: ""});

  const { pending, call } = useAsync<DepositParams, void>(
    ({ web3, account, params_obj }) => deposit(web3, account, params_obj)
  );
/*
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("target value: ", e.target.value);
    //setInput(e.target.value);
  }
  */

  const onChange = (name, value) => setInput(inputs => 
    
    
    ({
        
      ...inputs, [name]: value
    })     
);

  function onChangeExtract(e) {
      const {name, value} = e.target;
      onChange(name, value);
  }




  async function onSubmit(_e: React.FormEvent<HTMLFormElement>) {
    if (pending) {
      return;
    }

    if (!web3) {
      alert("No web3");
      return;
    }

    const offering_name = inputs.offering_name;

    const no_fixings = Web3.utils.toBN(inputs.no_fixings);
    const high_coupon = Web3.utils.toBN(inputs.high_coupon);
    const high_coupon_barrier = Web3.utils.toBN(inputs.high_coupon_barrier);
    const smaller_coupon = Web3.utils.toBN(inputs.smaller_coupon);
    const up_out_barrier = Web3.utils.toBN(inputs.up_out_barrier);
    const di_barrier = Web3.utils.toBN(inputs.di_barrier);


    const zero = Web3.utils.toBN(0);

    const params_obj = {
        offering_name,

         no_fixings,
         high_coupon ,
         high_coupon_barrier ,
         smaller_coupon,
         up_out_barrier,
         di_barrier

    }

    if (1) {
      const { error } = await call({
        web3,
        account,
        params_obj
        
      });

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        setInput({offering_name: "", no_fixings: "", high_coupon: "", high_coupon_barrier: "", smaller_coupon: "", up_out_barrier: "", di_barrier: ""});
        
      }
    }
  }

  return (
    <Form onSubmit={onSubmit} className="">
      <Form.Field>
        <Form.Input
          placeholder="Offering name"
          type="string"
          min={0}
          name="offering_name"
          onChange={onChangeExtract}
          
        />

        <Form.Input
          placeholder="Number of fixings"
          type="number"
          min={0}
          name = "no_fixings"
          onChange={onChangeExtract}
        

        />

        <Form.Input
          placeholder="High Coupon"
          type="number"
          min={0}
          name="high_coupon"
          onChange={onChangeExtract}
    

        />

          <Form.Input
          placeholder="High Coupon Barrier"
          type="number"
          min={0}
          name="high_coupon_barrier"
          onChange={onChangeExtract}
       

        
        />

        <Form.Input
          placeholder="Smaller Coupon"
          type="number"
          min={0}
          name="smaller_coupon"
          onChange={onChangeExtract}
       

        />


          <Form.Input
          placeholder="Up Out Barrier"
          type="number"
          min={0}
          name="up_out_barrier"
          onChange={onChangeExtract}
      

        />

        <Form.Input
          placeholder="Di Barrier"
          type="number"
          min={0}
          name="di_barrier"
          onChange={onChangeExtract}
       

        />

      </Form.Field>
      <Button content="Add Offering" primary disabled={pending} loading={pending}>
        
      </Button>
    </Form>
  );
};

export default DepositForm;
