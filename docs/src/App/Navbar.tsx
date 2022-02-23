import React, { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";
import { Button, Form } from "semantic-ui-react";
import { useWeb3Context } from "../contexts/Web3";
import useAsync from "../components/useAsync";
import { deposit } from "../api/TODWallet";
import AddOffering from  "./AddOffering";
import GetOfferings from  "./GetOfferings";



  import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";


interface Props {}

interface DepositParams {
  web3: Web3;
  account: string;
  value: BN;
}

const Navbar: React.FC<Props> = () => {
  const {
    state: { web3, account },
  } = useWeb3Context();


  return (
<Router>

<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <a className="navbar-brand" href="#">Yield Offering</a>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
      <Link to="/">
        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
        </Link>
      </li>
      <li className="nav-item">
      <Link to="/AddOffering">
        <a className="nav-link" href="#">Add Offering</a>
        </Link>
      </li>

      <li className="nav-item">
      <Link to="/GetOfferings">
        <a className="nav-link" href="#">Get Offerings</a>
        </Link>
      </li>


    </ul>
    <form className="form-inline my-2 my-lg-0">
      <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
  </div>
</nav>
<Switch>  
          <Route path="/AddOffering">
            <AddOffering />
          </Route>
          <Route path="/GetOfferings">
            <GetOfferings />
          </Route>
</Switch>
</Router>
  );
};

export default Navbar;

