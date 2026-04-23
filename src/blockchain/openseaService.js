import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export class OpenSeaService {
  constructor() {
    this.apiKey = process.env.OPENSEA_API_KEY;
    this.contractAddress = process.env.CONTRACT_ADDRESS;
  }

  async listNFT(tokenId, contractAddress, price = "0.01") {
    if (!this.apiKey || this.apiKey === "your_opensea_api_key") {
      console.log("⏩ OpenSea API key non configurata");
      return null;
    }

    const provider = new (await import("ethers")).JsonRpcProvider(process.env.RPC_URL);
    const wallet = new (await import("ethers")).Wallet(process.env.PRIVATE_KEY, provider);
    const owner = wallet.address;

    console.log(`Listing NFT #${tokenId} su OpenSea per ${price} ETH...`);

    try {
      const priceWei = (BigInt(parseFloat(price) * 1e18)).toString();

      const response = await axios.post(
        "https://api.opensea.io/v2/listings",
        {
          asset: {
            token_id: tokenId.toString(),
            token_address: contractAddress || this.contractAddress,
            chain: "matic"
          },
          start_amount: price,
          currency: "0x0000000000000000000000000000000000000000",
          protocol_data: {
            offerer: owner,
            zone: "0x0000000000000000000000000000000000000000",
            salt: Math.floor(Math.random() * 1e12).toString(),
            start_time: Math.floor(Date.now() / 1000),
            end_time: Math.floor(Date.now() / 1000) + 86400 * 30,
            offer: [{
              item_type: 2,
              token: contractAddress || this.contractAddress,
              identifier_or_criteria: tokenId.toString(),
              start_amount: priceWei,
              end_amount: priceWei
            }],
            consideration: [{
              item_type: 2,
              token: contractAddress || this.contractAddress,
              identifier_or_criteria: tokenId.toString(),
              start_amount: priceWei,
              end_amount: priceWei,
              recipient: owner
            }],
            counter: 0
          }
        },
        {
          headers: {
            "Authorization": this.apiKey,
            "Content-Type": "application/json",
            "X-API-KEY": this.apiKey
          }
        }
      );

      console.log(`✅ NFT #${tokenId} listato su OpenSea!`);
      console.log(`   Link: https://opensea.io/assets/matic/${contractAddress || this.contractAddress}/${tokenId}`);
      return response.data;
    } catch (error) {
      console.log(`⚠️ Errore listing: ${error.response?.data?.error?.message || error.message}`);
      return null;
    }
  }
}