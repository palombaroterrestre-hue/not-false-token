import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export class OpenSeaService {
  constructor() {
    this.apiKey = process.env.OPENSEA_API_KEY;
    this.baseUrl = "https://api.opensea.io/api/v2";
  }

  async listNFT(tokenId, contractAddress, priceEth = "0.01") {
    try {
      console.log(`Messa in vendita NFT #${tokenId} su OpenSea...`);
      
      if (!this.apiKey || this.apiKey === "your_opensea_api_key") {
        console.log("OpenSea API key non configurata. Skip listing.");
        console.log("Per abilitare: aggiungi OPENSEA_API_KEY nel .env");
        console.log("Oppure vendi manualmente su OpenSea.");
        return null;
      }

      const response = await axios.post(
        `${this.baseUrl}/listings`,
        {
          asset: {
            token_id: tokenId.toString(),
            token_address: contractAddress,
            chain: "matic",
          },
          start_amount: priceEth,
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
            "Authorization": `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "X-API-KEY": this.apiKey,
          },
        }
      );

      console.log(`Lista creata: ${response.data.response}`);
      console.log(`Prezzo: ${priceEth} ETH`);
      return response.data;
    } catch (error) {
      console.log("Errore listing OpenSea:", error.response?.data?.message || error.message);
      console.log("NFT mintato. Vendilo manualmente su OpenSea dopo.");
      return null;
    }
  }
}