import axios from 'axios';
import fs from 'fs';
import path from 'path';

export class NFTGenerator {
  async generateImage(prompt, trendName) {
    try {
      console.log(`Generazione immagine via Pollinations.ai per il trend: ${trendName}...`);
      
      const encodedPrompt = encodeURIComponent(prompt);
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;
      
      const response = await axios.get(url, {
        responseType: 'arraybuffer'
      });

      console.log('Immagine generata con successo.');

      const imagePath = path.join(process.cwd(), 'temp_nft.png');
      fs.writeFileSync(imagePath, response.data);

      return imagePath;
    } catch (error) {
      console.error('Errore nella generazione dell\'-immagine:', error.message);
      throw error;
    }
  }
}