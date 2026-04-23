import cron from 'node-cron';
import { TrendAgent } from './agent/trendAgent.js';
import { NFTGenerator } from './agent/nftGenerator.js';
import { IPFSService } from './blockchain/ipfsService.js';
import { NFTMinter } from './blockchain/minter.js';
import { OpenSeaService } from './blockchain/openseaService.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const trendAgent = new TrendAgent();
const nftGenerator = new NFTGenerator();
const ipfsService = new IPFSService();
const nftMinter = new NFTMinter();
const openseaService = new OpenSeaService();

async function runDailyTask() {
  try {
    console.log('--- Inizio Task Giornaliero ---');

    const trendData = await trendAgent.getLatestTrend();
    console.log(`Trend: ${trendData.trend}`);

    const imagePath = await nftGenerator.generateImage(trendData.prompt, trendData.trend);

    console.log('Caricamento immagine su IPFS...');
    const imageHash = await ipfsService.uploadImage(imagePath);
    const imageUrl = `ipfs://${imageHash}`;

    const metadata = {
      name: `Trend NFT: ${trendData.trend}`,
      description: trendData.description,
      image: imageUrl,
      attributes: [
        { trait_type: "Trend", value: trendData.trend },
        { trait_type: "Data", value: new Date().toISOString() }
      ]
    };

    console.log('Caricamento metadata su IPFS...');
    const metadataHash = await ipfsService.uploadMetadata(metadata);
    const tokenURI = `ipfs://${metadataHash}`;

    const walletAddress = await nftMinter.getOwnerAddress();
    const receipt = await nftMinter.mint(walletAddress, tokenURI);
    
    const tokenId = 1;

    console.log('Tentativo listing su OpenSea...');
    await openseaService.listNFT(tokenId, process.env.CONTRACT_ADDRESS);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    console.log('--- Task Giornaliero Completato con Successo ---');
  } catch (error) {
    console.error('Errore nel task giornaliero:', error);
  }
}

cron.schedule('0 0 * * *', () => {
  console.log('Esecuzione task programmato...');
  runDailyTask();
});

runDailyTask();