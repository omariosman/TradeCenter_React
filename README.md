# Important Note 1: 
The front end will not work on a contract deployed locally, because i use oracles the outside world, so, only run truffle tests when testing on locally deployed contract

# Important Note 2: 
Migrate only on Kovan testnet, the chainlink oracle I use resides on this chain


# Prerequisites:
> Ganache
> Truffle
> npm


# Testing Contracts:
- cd into the TODWallet directory
- npm install @openzeppelin/test-helpers
-  Run Ganache 
- run truffle test


# running FrontEnd:
- cd into the TODWallet directory
- cd migrations
- in the 2_deploy_contracts.js:
> modify the parameters of the wallet as you wish:
> owners: who can make transactions and confirm them
> Confirmations: the number of confirmations required for a transaction to execute
> heirs: addresses of people who will receive the wallet balance after owner is dead
> PeriodAfterVoting: if heirs voted the owner dead while he is alive, the owner can ping the smart contract in this period to prove that he is alive and the money will stay in the wallet
> go to truffle-config.js, and paste your mnemonic in the mnemonic variable as a string.
> truffle migrate --reset --compile-all --network kovan
> cd build/contracts
> copy the TODWallet.js file
> cd into FRONTEnd/src/build/contracts
> paste the copied file
> cd FRONTEnd
> npm start

# Project Description

- An eth wallet that enables multiple owners to have access rights over the funds, and  a transaction made by one owner must have a number of confirmations to be executed
- This eth wallet implements a transfer on death functionality
> If all heirs agree that the owner is dead, the wallet will inform the owner that the heirs voted him dead, giving him an opportunity to say to the wallet that he is alive.  if he didnt say that he is alive in a certain period determined during the migration of the contract, the wallet will divide its balance on the number of the heirs then dispatch the eth to their addresses.
> If the heirs stated that the owner is dead and he was alive, they become prohibited from ever voting again (untrusted heirs)


# ScreenCast videos

1- Scenario 1:  https://youtu.be/9859qdAvWOs
>Both heirs voted that the owner is dead, and the owner did not ping the wallet in the specified time:

2- Scenario 2:  https://youtu.be/XdPLtoyhEJs
>the heirs voted dead, but the owner was alive and pinged the wallet

3- normal multisigwallett functionality: https://youtu.be/SqBt1mAJVHc
> testing confirmations by other owners


>>>>>>> final project


# public wallet address for nft
- 0xa5FD53AE86B24F943869abfbfBF0B8cd03C80043

