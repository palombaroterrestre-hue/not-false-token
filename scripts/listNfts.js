import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const API_KEY = process.env.OPENSEA_API_KEY;
const CONTRACT = process.env.CONTRACT_ADDRESS;
const OWNER = "0xEaEf7b52382683f685aF19d4c36A504079d828A5";

async function createListing(tokenId, pricematic = "0.01") {
  console.log(`Listing NFT #${tokenId}...`);

  const priceWei = (parseFloat(pricematic) * 1e18).toString();

  try {
    const response = await axios.post(
      `https://api.opensea.io/v2/listings`,
      {
        asset: {
          token_id: tokenId,
          token_address: CONTRACT,
          chain: "matic"
        },
        start_amount: pricematic,
        currency: {
          address: "0x0000000000000000000000000000000000000000",
          decimals: 18,
          name: "MATIC",
          symbol: "MATIC"
        },
        protocol_data: {
          offerer: OWNER,
          zone: "0x0000000000000000000000000000000000000000",
          salt: Math.floor(Math.random() * 1e12).toString(),
          start_time: Math.floor(Date.now() / 1000),
          end_time: Math.floor(Date.now() / 1000) + 86400 * 30,
          offer: [{
            item_type: 2,
            token: CONTRACT,
            identifier_or_criteria: tokenId.toString(),
            start_amount: priceWei,
            end_amount: priceWei
          }],
          consideration: [{
            item_type: 2,
            token: CONTRACT,
            identifier_or_criteria: tokenId.toString(),
            start_amount: priceWei,
            end_amount: priceWei,
            recipient: OWNER
          }],
          counter: 0
        }
      },
      {
        headers: {
          "Authorization": API_KEY,
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY
        }
      }
    );

    console.log(`✅ NFT #${tokenId} listed!`);
    return response.data;
  } catch (error) {
    console.log(`❌ NFT #${tokenId}: ${error.response?.data?.error?.message || error.message}`);
    return null;
  }
}

async function main() {
  console.log(`Contract: ${CONTRACT}`);
  console.log(`Owner: ${OWNER}`);
  console.log("");

  for (let i = 0; i < 2; i++) {
    await createListing(i.toString(), "0.01");
    await new Promise(r => setTimeout(r, 2000));
  }
}

main();