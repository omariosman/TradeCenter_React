const TODWallet = artifacts.require('TODWallet');

module.exports = async function (deployer,network, accounts) {
const owners = ["0xa5FD53AE86B24F943869abfbfBF0B8cd03C80043","0x5373beD36e4A96778384b695F4587b2a6AEc25BF"]
const Confirmations= 1
const hiers = ["0x1040ce2D9B3D00edBb529784e83e1B20Aa1e0D7D", "0x6Cd27c26AAA0B5956342f75F1a325d75C27149eC"]
const PeriodAfterVoting = 200 //for testing only, better be alot more than that!


await deployer.deploy(TODWallet , owners, Confirmations , hiers, PeriodAfterVoting);
const multiSigWallet = await TODWallet.deployed()
};


