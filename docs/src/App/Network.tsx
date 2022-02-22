import React from "react";
import "./css/network_css.css" 


interface Props {
  netId: number;
}

function getNetwork(netId: number) {
  switch (netId) {
    case 1:
      return "Mainnet";
    case 2:
      return "Morden test network";
    case 3:
      return "Ropsten network";
    case 4:
      return "Rinkeby test network";
    case 42:
      return "Kovan test network";
    case 999:
      return "Mainnet fork test network";
    default:
      return "Unkown network";
  }
}

const Network: React.FC<Props> = ({ netId }) => {
  return <div><span className="badge badge-secondary">Network name:</span> {getNetwork(netId)}</div>;
};

export default Network;
