/** @type import('hardhat/config').HardhatUserConfig */
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  // defaultNetwork: "",
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_RPC_URL || "",
      accounts: process.env.CHAINDRIVE_PRIVATE_WALLET_KEY
        ? [process.env.CHAINDRIVE_PRIVATE_WALLET_KEY]
        : [],
    },
  },
  typechain: {
    outDir: "./src/typechain-types",
    target: "ethers-v6",
  },
};

export default config;
