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

    // 1. Monitoraggio Trend
    const trendData = await trendAgent.getLatestTrend();

    // 2. Generazione Immagine
    const imagePath = await nftGenerator.generateImage(trendData.prompt, trendData.trend);

    // 3. Caricamento su IPFS
    console.log('Caricamento immagine su IPFS...');
    const imageHash = await ipfsService.uploadImage(imagePath);
    const imageUrl = `ipfs://${imageHash}`;

    // 4. Creazione Metadata
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

    // 5. Minting
    const walletAddress = await nftMinter.getOwnerAddress();
    const receipt = await nftMinter.mint(walletAddress, tokenURI);
    
    // Recupera tokenId dal receipt (semplificato)
    // In un caso reale, estrarremmo il tokenId dai logs
    const tokenId = 1; // Placeholder

    // 6. Messa in vendita su OpenSea
    await openseaService.listNFT(tokenId, process.env.CONTRACT_ADDRESS);

    // Pulizia
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    console.log('--- Task Giornaliero Completato con Successo ---');
  } catch (error) {
    console.error('Errore nel task giornaliero:', error);
  }
}

// Schedula il task per ogni giorno a mezzanotte
cron.schedule('0 0 * * *', () => {
  console.log('Esecuzione task programmato...');
  runDailyTask();
});

// Esegui subito al primo avvio (opzionale)
runDailyTask();
