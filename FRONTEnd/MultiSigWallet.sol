pragma solidity ^0.8.9;
//import "truffle/Console.sol";

contract TODWallet {
    string public name = "TODWallet";
    event Deposit(address indexed sender, uint amount, uint balance);
    event requestTx(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint value,
        bytes data
    );
    event approveTx(address indexed owner, uint indexed txIndex);
    event removeConfirmation(address indexed owner, uint indexed txIndex);
    event execTx(address indexed owner, uint indexed txIndex);
    event printvotes(uint a7a);
    event sure(address payable a7a);
    address[] public owners;
    address [] public hiers;
    mapping(address => bool) public isOwner;
    mapping(address => bool) public isVoted;
    mapping(address => bool) public isHier;

    

    uint public Confirmations;
    uint public votes;
    uint public LastPing;
    

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations;
    }

    // mapping from tx index => owner => bool
    mapping(uint => mapping(address => bool)) public isConfirmed;

    Transaction[] public transactions;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

    constructor(address[] memory _owners, uint _numConfirmationsRequired , address[] memory _hiers) {
        
        require(_owners.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }
         for (uint i = 0; i < _hiers.length; i++) {
            address hier = _hiers[i];

            require(hier != address(0), "invalid owner");
            require(!isHier[hier], "owner not unique");

            isHier[hier] = true;
            hiers.push(hier);
        }


        Confirmations = _numConfirmationsRequired;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }
   


    function requestTxFunc(
        address _to,
        uint _value,
        bytes memory _data
    ) public onlyOwner {
        uint txIndex = transactions.length;

        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                data: _data,
                executed: false,
                numConfirmations: 0
            })
        );

        emit requestTx(msg.sender, txIndex, _to, _value, _data);
    }

    function approveTxFunc(uint _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit approveTx(msg.sender, _txIndex);
    }

    function execTxFunc(uint _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(
            transaction.numConfirmations >= Confirmations,
            "cannot execute tx"
        );

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, "tx failed");

        emit execTx(msg.sender, _txIndex);
    }

    function removeConfirmationFunc(uint _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

        emit removeConfirmation(msg.sender, _txIndex);
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getHiers() public view returns (address[] memory) {
        return hiers;
    }

    function numberOfTransactionsGetter() public view returns (uint) {
        return transactions.length;
    }




    function TxGetter(uint _txIndex)
        public
        view
        returns (
            address to,
            uint value,
            bytes memory data,
            bool executed,
            uint numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }

    
    function test (address payable recv) external {
        
        recv = payable(hiers[0]);
        recv.transfer(1 ether);
        
    }


    function OwnerIsDeceased(address payable hier )public {
        
        require (isHier[hier]== true);
        require(isVoted[hier]== false);
        isVoted[hier]== true;
        //uint to_transfer = address(this).balance / 
        
        votes =votes+1;
        if (votes == 2){
                emit printvotes(votes);
            
            for (uint i=0 ; i<hiers.length; i=i+1){
            payable(hiers[i]).transfer(1 ether);
            }

    
    }
    }

    function IamAllive() public {
require (msg.sender == owners[0]);
LastPing = block.timestamp;
    }

function IfOwnerDead() public {

uint diff = block.timestamp - LastPing;
if (diff > 2629746 ){
    
for (uint i=0 ; i<hiers.length; i=i+1){
            payable(hiers[i]).transfer(1 ether);
            }

}

}



}
