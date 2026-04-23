import OpenSea from "opensea-js";
import { ethers } from "ethers";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import path from "path";

dotenv.config();

const API_KEY = process.env.OPENSEA_API_KEY;
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const ABI = [
  "function mintNFT(address recipient, string memory tokenURI) public returns (uint256)"
];

async function listOnOpenSea(tokenId, priceEth = "0.01") {
  const owner = new ethers.Wallet(PRIVATE_KEY);
  const priceWei = ethers.parseEther(priceEth);

  try {
    const response = await axios.post(
      "https://api.opensea.io/v2/listings",
      {
        asset: {
          token_id: tokenId.toString(),
          token_address: CONTRACT_ADDRESS,
          chain: "matic"
        },
        start_amount: priceEth,
        currency: "0x0000000000000000000000000000000000000000",
        protocol_data: {
          offerer: owner.address,
          zone: "0x0000000000000000000000000000000000000000",
          salt: Math.floor(Math.random() * 1e12).toString(),
          start_time: Math.floor(Date.now() / 1000),
          end_time: Math.floor(Date.now() / 1000) + 86400 * 30,
          offer: [{
            item_type: 2,
            token: CONTRACT_ADDRESS,
            identifier_or_criteria: tokenId.toString(),
            start_amount: priceWei.toString(),
            end_amount: priceWei.toString()
          }],
          consideration: [{
            item_type: 2,
            token: CONTRACT_ADDRESS,
            identifier_or_criteria: tokenId.toString(),
            start_amount: priceWei.toString(),
            end_amount: priceWei.toString(),
            recipient: owner.address
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

    console.log(`✅ NFT #${tokenId} listed on OpenSea for ${priceEth} ETH`);
    return response.data;
  } catch (error) {
    console.log(`⚠️ Listing NFT #${tokenId}: ${error.response?.data?.error?.message || error.message}`);
    return null;
  }
}

async function main() {
  console.log("--- Inizio Task Giornaliero ---");

  const trendAgent = (await import("./src/agent/trendAgent.js")).TrendAgent;
  const nftGenerator = (await import("./src/agent/nftGenerator.js")).NFTGenerator;
  const ipfsService = (await import("./src/blockchain/ipfsService.js")).IPFSService;

  const trendData = await new trendAgent().getLatestTrend();
  console.log(`Trend: ${trendData.trend}`);

  const imagePath = await new nftGenerator().generateImage(trendData.prompt, trendData.trend);
  
  const imageHash = await new ipfsService().uploadImage(imagePath);
  const metadataHash = await new ipfsService().uploadMetadata({
    name: `Trend NFT: ${trendData.trend}`,
    description: trendData.description,
    image: `ipfs://${imageHash}`,
    attributes: [
      { trait_type: "Trend", value: trendData.trend },
      { trait_type: "Data", value: new Date().toISOString() }
    ]
  });

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  const tx = await contract.mintNFT(wallet.address, `ipfs://${metadataHash}`);
  await tx.wait();
  
  const tokenId = 1;

  if (API_KEY) {
    await listOnOpenSea(tokenId, "0.01");
  } else {
    console.log("⏩ OpenSea API key non configurata - NFT mintato ma non listato");
  }

  if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  console.log("--- Task Completato ---");
}

main().catch(console.error);