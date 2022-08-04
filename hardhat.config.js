require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
const fs = require('fs');

task("deploy", "Deploys the contract, updates abi and address") 
  // .addParam("env", "test or production")
  .setAction(async () => {
    const contractFactory = await hre.ethers.getContractFactory("ClearFeed");
    const contract = await contractFactory.deploy();
    await contract.deployed();

    console.log("deployed to:", contract.address);

    function editFile() {
      const data = fs.readFileSync('./utils/address.js', 'utf-8');
  
      const remove_after= data.indexOf('"');
      const pre =  data.substring(0, remove_after);
      const result = pre + '"' + contract.address + '"'
  
      fs.writeFileSync('./utils/address.js', result, 'utf-8');
    }
    editFile();
    fs.copyFile('artifacts/contracts/clearfeed.sol/ClearFeed.json','./utils/ClearFeed.json',
      (err) => {
       if (err) throw err;
       console.log('source.txt was copied to destination.txt');
      });  
    })


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",

  networks: {
    hardhat: {
    },
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts: [process.env.MUMBAI_ACCOUNT]
    },
    polygon: {
      url: process.env.MAIN_URL,
      accounts: [process.env.MAIN_ACCOUNT]
    }
  },
  etherscan: {
    apiKey: process.env.POLY_SCAN_KEY
  },
};
