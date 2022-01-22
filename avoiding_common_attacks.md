

- using specific compiler pragma (SWC-103)
> I have only used 0.8.9 compiler version

- proper use of Require (SWC-123)


- modifiers only for validation
> I did not write any logic to be executed before the function is called, I have just placed a check in each modifier.

- Checks-Effects-Interactions (Avoiding state changes after external calls)
> in my logic, no logic is implemented after a .call is used


- Pull Over Push (Prioritize receiving contract calls over making contract calls)
> Most calls is made by heirs and owners, except for the single instance that the contract sends ether to heirs on the owner's death. 
