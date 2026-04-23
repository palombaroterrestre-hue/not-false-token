import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config = {
  solidity: {
    version: "0.8.25",
    settings: {
      evmVersion: "cancun"
    }
  },
  networks: {
    polygon: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/1sSg_SOtZK6I8wHVIl9WA",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 137,
    },
  },
};

export default config;