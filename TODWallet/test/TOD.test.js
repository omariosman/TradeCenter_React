const { assert } = require("chai")
const chai= require ("chai");

chai .use (require("chai-as-promised"))
const expect=chai.expect

const {time}= require('@openzeppelin/test-helpers');





const TODWallet = artifacts.require("TODWallet")


contract ("TODWallet", accounts => {
const owners = [accounts[0]]
const hiers = [accounts[6], accounts[7]]
const NUM_CONFIRAMTIONS_REQUIRED= 1
const PeriodAfterVoting = 300





let wallet 
beforeEach(async() => {
    wallet = await TODWallet.new(owners, NUM_CONFIRAMTIONS_REQUIRED, hiers, PeriodAfterVoting)
})




it ("Informs the owner that hiers voted him dead", async()=> {
  First_Hier_Vote = await wallet.OwnerIsDeceased({from: accounts[6]})
  var Reminder = await wallet.getReminder()
  assert.equal (Reminder, "All good")

  Second_Hier_Vote= await wallet.OwnerIsDeceased({from: accounts[7]})

  Reminder = await wallet.getReminder()
  assert.equal (Reminder, "The hiers voted that the owner is dead, If you are the owner, please click ping in a month period to confirm you are alive!")


})




it("should receive ether", async () => {
    const { logs } = await wallet.sendTransaction({
      from: accounts[0],
      value: 1,
    })

    assert.equal(logs[0].event, "Deposit")
    assert.equal(logs[0].args.sender, accounts[0])
    assert.equal(logs[0].args.amount, 1)
    assert.equal(logs[0].args.balance, 1)
  })



it("Sends Funds to Hiers on Owner's Death",async() =>{
    //Sending Some eth from accounts[9] to the smart contract, then printing that amount in the console
    let send = await web3.eth.sendTransaction({from:accounts[9],to:wallet.address, value:web3.utils.toWei("4", "ether")});
number = await TODWallet.PeriodAfterVoting
    console.log(number)
    var wallet_balance = await web3.eth.getBalance(wallet.address)//wallet balance after depositing 4 eth from accounts[9]
    console.log("Current wallet Balance: ",web3.utils.fromWei(wallet_balance, "ether"), "ether")


    //The two hiers voting that the owner is dead
    First_Hier_Vote = await wallet.OwnerIsDeceased({from: accounts[6]})
    Second_Hier_Vote= await wallet.OwnerIsDeceased({from: accounts[7]})


    //getting balance of both hiers before voting:
    var First_Hier_Balance = await web3.eth.getBalance(accounts[6])
    console.log("Current first Hier Balance: ",web3.utils.fromWei(First_Hier_Balance, "ether"), "ether")
    var Second_Hier_Balance = await web3.eth.getBalance(accounts[7])
    console.log("Current second Hier Balance: ",web3.utils.fromWei(Second_Hier_Balance, "ether"), "ether")


    //Advancing time by 5000 seconds, Without calling wallet.IamAllive()

    await time.increase(5000)

   
    console.log("----------------")

    await wallet.IfOwnerDead()//calling the task that should be called regularly by Gelato in the case of public testnet
    var wallet_balance_after_death = await web3.eth.getBalance(wallet.address)
    console.log(" wallet Balance After Death: ",web3.utils.fromWei(wallet_balance_after_death, "ether"), "ether")


    var First_Hier_Balance_After = await web3.eth.getBalance(accounts[6])
    var Second_Hier_Balance_After = await web3.eth.getBalance(accounts[7])
    console.log(" first Hier Balance After: ",web3.utils.fromWei(First_Hier_Balance_After, "ether"), "ether")
    console.log(" first Hier Balance After: ",web3.utils.fromWei(First_Hier_Balance_After, "ether"), "ether")




    First_Hier_Balance_Increase= First_Hier_Balance_After-First_Hier_Balance //balance increase of first hier
    Second_Hier_Balance_Increase= Second_Hier_Balance_After-Second_Hier_Balance //balance increase of second hier

    assert.equal(wallet_balance_after_death, 0) //check all funds was sent to hiers
    
    //console.log(web3.utils.fromWei(String(Second_Hier_Balance_Increase),"ether"))
    assert.equal(web3.utils.fromWei(String(First_Hier_Balance_Increase),"ether"), "2") //balance of first hier increased by half the balance of the wallet
    assert.equal(web3.utils.fromWei(String(Second_Hier_Balance_Increase),"ether") ,"2")//balance of second hier increased by half the balance of the wallet
   


})

it ("Does not emit balance of owner pinged after hiers voted dead", async() => {

//Sending Some eth from accounts[9] to the smart contract, then printing that amount in the console
let send = await web3.eth.sendTransaction({from:accounts[9],to:wallet.address, value:web3.utils.toWei("4", "ether")});
balance = await web3.eth.getBalance(wallet.address)
console.log("Current wallet Balance: ",web3.utils.fromWei(balance, "ether"), "ether")


//The two hiers voting that the owner is dead
First_Hier_Vote = await wallet.OwnerIsDeceased({from: accounts[6]})
Second_Hier_Vote= await wallet.OwnerIsDeceased({from: accounts[7]})

await time.increase(100) //waiting 100 seconds after hiers voted dead to call IamAllive()



//Advancing time by 5000 seconds, Without calling wallet.IamAllive()
var current_time = await time.latest()
console.log("time 1 ",current_time)
await time.increase(500)

await wallet.IamAllive({from:owners[0]})

time_after = await time.latest()
console.log("time 2",time_after)

await wallet.IfOwnerDead()
balance = await web3.eth.getBalance(wallet.address)
console.log(" wallet Balance After Death: ",web3.utils.fromWei(balance, "ether"), "ether")
    })



  
    describe("submitTransaction", () => {
        const to = accounts[4]
        const value = 0
        const data = "0x0123"
    
        it("should submit transaction", async () => {
          const { logs } = await wallet.requestTxFunc(to, value, data, {
            from: owners[0],
          })
          
    
          assert.equal(logs[0].event, "requestTx")
          assert.equal(logs[0].args.owner, owners[0])
          assert.equal(logs[0].args.txIndex, 0)
          assert.equal(logs[0].args.to, to)
          assert.equal(logs[0].args.value, value)
          assert.equal(logs[0].args.data, data)
    
          assert.equal(await wallet.numberOfTransactionsGetter(), 1)
    
          const tx = await wallet.TxGetter(0)
          assert.equal(tx.to, to)
          assert.equal(tx.value, value)
          assert.equal(tx.data, data)
          assert.equal(tx.numConfirmations, 0)
          assert.equal(tx.executed, false)
        })
    
        it("should reject if not owner", async () => {
          await expect(
            wallet.requestTxFunc(to, value, data, {
              from: accounts[3],
            })
          ).to.be.rejected
        })
      })



})



