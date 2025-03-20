/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    holesky: {
      url: process.env.ALCHEMY_RPC_URL,
      accounts: [process.env.CHAINDRIVE_PRIVATE_WALLET_KEY],
    },
  },
};
