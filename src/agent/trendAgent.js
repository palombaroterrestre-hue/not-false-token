import { Ollama } from 'ollama';
import dotenv from 'dotenv';

dotenv.config();

export class TrendAgent {
  constructor() {
    this.model = "gemma4:31b-cloud";
    this.client = new Ollama({
      host: 'https://api.ollama.com',
      headers: {
        'Authorization': `Bearer ${process.env.OLLAMA_CLOUD_API_KEY}`
      }
    });
  }

  async getLatestTrend() {
    try {
      console.log(`Monitoraggio dei trend via Ollama Cloud (${this.model})...`);
      
      const response = await this.client.generate({
        model: this.model,
        prompt: `Identifica un trend esplosivo di oggi. Rispondi in italiano. 
        Rispondi SOLO con un oggetto JSON valido con questi campi:
        {
          "trend": "nome",
          "description": "descrizione",
          "prompt": "prompt dettagliato in inglese per Stable Diffusion"
        }`,
        stream: false,
        format: "json"
      });

      console.log('Risposta da Ollama Cloud ricevuta.');

      const responseText = response.response;
      const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/);
      const cleanJson = jsonMatch ? jsonMatch[1] : responseText.replace(/```json\n?/, '').replace(/```$/, '');
      const trendData = JSON.parse(cleanJson.trim());
      console.log(`Trend trovato: ${trendData.trend}`);
      return trendData;
    } catch (error) {
      console.error('Errore nel recupero dei trend via Ollama Cloud:', error.message);
      throw error;
    }
  }
}
