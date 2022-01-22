


# Design Pattern Decisions:

# Inheritance and Interfaces/ Oracles

- AggregatorV3Interface.sol
	> From Chainlink's documenation, I have used the AggregatorV3Interface to get the latest Ethereum price. This in fact an oracle that gets this price from offchain data.



# Access Control Design Patterns

- AccessControl.sol:
	> I imported this into my contract to manage roles. In my case, I have owners and heirs. the heirs do not have any control of the wallet but can recieve the wallet's funds in case the owner is dead. I have used AccessControl.sol to do this 



# Covered design patterns:
```
- [x] Inheritance and interfaces
- [x] Oracles 
- [x] Access Control Design Patterns

```

