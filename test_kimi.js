import { TrendAgent } from './src/agent/trendAgent.js';

async function testKimi() {
  const agent = new TrendAgent();
  try {
    const trend = await agent.getLatestTrend();
    console.log('--- TEST SUCCESS ---');
    console.log(JSON.stringify(trend, null, 2));
  } catch (error) {
    console.error('--- TEST FAILED ---');
    console.error(error.message);
    console.log('Assicurati di aver inserito OLLAMA_CLOUD_API_KEY nel file .env');
  }
}

testKimi();
