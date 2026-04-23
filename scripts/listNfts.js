import pkg from "hardhat";
const { ethers } = pkg;
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

async function listNFTs() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const apiKey = process.env.OPENSEA_API_KEY;

  console.log("Checking NFT ownership...");

  const contract = new ethers.Contract(
    contractAddress,
    [
      "function ownerOf(uint256) view returns (address)",
      "function tokenURI(uint256) view returns (string)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address) view returns (uint256)"
    ],
    wallet
  );

  const balance = await contract.balanceOf(wallet.address);
  console.log(`NFTs in wallet: ${balance.toString()}`);

  const baseUrl = "https://api.opensea.io/api/v2/listings";

  for (let i = 0; i < balance; i++) {
    try {
      console.log(`\nListing NFT #${i}...`);

      const response = await axios.post(
        baseUrl,
        {
          asset: {
            token_id: i.toString(),
            token_address: contractAddress,
            chain: "matic",
          },
          start_amount: 0.01,
          currency: {
            address: "0x0000000000000000000000000000000000000000",
            decimals: 18,
            name: "MATIC",
            symbol: "MATIC",
          },
          protocol: "seaport",
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "X-API-KEY": apiKey,
          },
        }
      );

      console.log(`NFT #${i} listed! Response:`, response.data);
    } catch (error) {
      console.log(`Error listing NFT #${i}:`, error.response?.data?.message || error.message);
    }
  }
}

listNFTs().catch(console.error);