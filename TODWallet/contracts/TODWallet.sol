pragma solidity 0.8.9;
import "./AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

///import "@openzeppelin/contracts/access/Ownable.sol";

///@title A Transfer On Death MultiSig Wallet
///@author Salaheldin Soliman
///@dev this is using role based access control
contract TODWallet is AccessControl  {
    bytes32 public constant HIER_ROLE = keccak256("HIER_ROLE");
 

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
 
    address[] public owners;
    address [] public hiers;
    mapping(address => bool) public isOwner;
    mapping(address => bool) public isVoted;

    ///@notice period to ping the contract if hiers voted the owner dead in seconds
    uint public PeriodAfterVoting;

    

    uint public Confirmations;
    uint public votes;
    uint public LastPing = block.timestamp;
    uint public AllVotedDead = 0;
    string public Reminder= "";
    uint public TimeLeft = 0;

    AggregatorV3Interface internal priceFeed;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations;
    }

    mapping(uint => mapping(address => bool)) public isConfirmed;

    Transaction[] public transactions;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Only Owner can do this!");
        _;
    }

    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "No transaction by this index");
        _;
    }

    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "transaction is already done");
        _;
    }

    modifier notConfirmed(uint _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "cant confirm transaction twice from sane user");
        _;
    }
///@param _owners is a list of owners
///@param _numConfirmationsRequired confs required for a tx to be completed
///@param _hiers is a list of heirs
///@param _PeriodAfterVoting is a period given to owner to ping the contract after heris voted him dead in  second
    constructor(address[] memory _owners, uint _numConfirmationsRequired , address[] memory _hiers, uint _PeriodAfterVoting) {
         require(_owners.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );
        priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
       

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

            hiers.push(hier);
            _setupRole(HIER_ROLE, hier);
        }


        Confirmations = _numConfirmationsRequired;
        PeriodAfterVoting = _PeriodAfterVoting;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }
 

///@notice request a Tx to be made
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

///@notice confirm Tx
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


///@notice execute Tx afte num of confirmations reached
///@param _txIndex of tx to be executed
    function execTxFunc(uint _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(
            transaction.numConfirmations >= Confirmations,
            "couldn't exec transaction"
        );

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data
        );
        require(success, "Failed!");

        emit execTx(msg.sender, _txIndex) ;
    }

///@notice called to remove confirmation
    function removeConfirmationFunc(uint _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender]);

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

        emit removeConfirmation(msg.sender, _txIndex);
    }

///@notice get list of owners
////@return owners
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

///@notice get list of heirs
////@return heirs
    function getHiers() public view returns (address[] memory) {
        return hiers;
    }

///@notice get number of Txs
////@return number of txs
    function numberOfTransactionsGetter() public view returns (uint) {
        return transactions.length;
    }



///@notice get list of transactions
///@param _txIndex is the index of the transaction 

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


    ///@notice get the latest price of ethereum from an oracle
    ///@dev  uint80 roundID, uint startedAt,uint timeStamp, uint80 answeredInRound are unused vars
    function getLatestPrice() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;}
    
    ///@notice function get called by the hier to inform to tell the contract the owner is dead
    function OwnerIsDeceased()public onlyRole(HIER_ROLE)  {
        require(isVoted[msg.sender]== false);
        Reminder= "All good";
        isVoted[msg.sender]== true;
        votes =votes+1;
        if (votes == hiers.length){

             AllVotedDead = block.timestamp;
             Reminder = "The hiers voted that the owner is dead, If you are the owner, please click ping in a month period to confirm you are alive!";

        }
        
    }


///@notice reminder type either "all good" or "heirs voted you dead"
///@return reminder for the owner
     function getReminder() public view returns (string memory){
         
            return Reminder;

    }

///@notice get the remaining amount of time to ping the wallet
///@return time left to ping
    function getTimeLeftToPing() public returns (uint){

        TimeLeft = block.timestamp;

        return TimeLeft;
    }

    ///@notice use this as the owner to tell the contract you are allive
    function IamAllive() public {
require (msg.sender == owners[0]);
LastPing = block.timestamp;
    }



    

///@notice function can be called by any one after the heris voted, but not before the period that the owned decided on
function IfOwnerDead() public {
    require(block.timestamp - AllVotedDead >= PeriodAfterVoting , "CANNOT CALL THIS FUNCTION NOW ATTACKER!!! GIVE THE OWNER HIS CHOSEN TIME TO PING!!!" );

uint diff = block.timestamp - LastPing;
if (diff > PeriodAfterVoting && votes == hiers.length){
     uint Contract_Balance = address(this).balance;
    uint to_transfer = Contract_Balance/hiers.length  ;
    
for (uint i=0 ; i<hiers.length; i=i+1){
            hiers[i].call{value: to_transfer}("You were a hier, here is your money");
            }}}
}
