import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const API_KEY = process.env.OPENSEA_API_KEY;
const CONTRACT = process.env.CONTRACT_ADDRESS;

async function refreshContract() {
  console.log("Refreshing contract on OpenSea...");
  
  try {
    const response = await axios.get(
      `https://api.opensea.io/v2/contracts/${CONTRACT}`,
      {
        headers: {
          "Authorization": API_KEY,
          "X-API-KEY": API_KEY
        }
      }
    );
    console.log("Contract info:", response.data);
  } catch (error) {
    console.log("Error:", error.response?.data || error.message);
  }
}

async function refreshNFT(tokenId) {
  console.log(`Refreshing NFT #${tokenId}...`);
  
  try {
    const response = await axios.get(
      `https://api.opensea.io/v2/tokens/${CONTRACT}/${tokenId}/refresh`,
      {
        headers: {
          "Authorization": API_KEY,
          "X-API-KEY": API_KEY
        }
      }
    );
    console.log(`✅ NFT #${tokenId} refreshed!`);
    return response.data;
  } catch (error) {
    console.log(`Refresh NFT #${tokenId}: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function main() {
  await refreshContract();
  await new Promise(r => setTimeout(r, 1000));
  
  for (let i = 0; i < 2; i++) {
    await refreshNFT(i.toString());
    await new Promise(r => setTimeout(r, 2000));
  }
}

main();