import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const ABI = [
  "function mintNFT(address recipient, string memory tokenURI) public returns (uint256)"
];

export class NFTMinter {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, this.wallet);
  }

  async getOwnerAddress() {
    return this.wallet.address;
  }

  async mint(recipient, tokenURI) {
    try {
      console.log('Minting NFT...');
      const tx = await this.contract.mintNFT(recipient, tokenURI);
      console.log(`Transazione inviata: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log('NFT mintato con successo!');
      
      // In ethers v6, events are handled differently. 
      // For simplicity, we'll just return the receipt.
      return receipt;
    } catch (error) {
      console.error('Errore durante il minting:', error);
      throw error;
    }
  }
}
