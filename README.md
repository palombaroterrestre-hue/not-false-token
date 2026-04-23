# AI Trend NFT Agent

Questo agente monitora i trend giornalieri, crea un'opera d'arte digitale basata su quel trend e la carica come NFT su OpenSea ogni giorno.

## Caratteristiche
- **Trend Monitoring**: Utilizza OpenAI per identificare i trend più caldi del giorno.
- **AI Art**: Genera immagini uniche usando DALL-E 3.
- **Blockchain**: Minting automatico su Polygon (o altra rete EVM).
- **Royalties**: Supporto per royalties EIP-2981 (impostate al 10% di default).
- **Automazione**: Esecuzione giornaliera programmata.

## Requisiti
1. **Node.js** installato.
2. Chiavi API per:
   - **OpenAI** (per trend e immagini).
   - **Pinata** (per l'hosting IPFS).
   - **OpenSea** (opzionale, per listing avanzato).
3. Un wallet con alcuni fondi (es. MATIC su Polygon) per coprire il gas del minting.

## Configurazione
Crea un file `.env` nella root del progetto (o usa quello esistente) e compila i seguenti campi:

```env
OPENAI_API_KEY=tuo_openai_key
PRIVATE_KEY=tua_chiave_privata_wallet
RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=indirizzo_del_contratto_deployato
PINATA_API_KEY=tua_pinata_key
PINATA_SECRET_API_KEY=tua_pinata_secret
```

## Installazione
```bash
npm install
```

## Utilizzo
Per avviare l'agente:
```bash
npm start
```

Il task è impostato per essere eseguito ogni giorno a mezzanotte (`0 0 * * *`), ma eseguirà anche un primo run immediato all'avvio.

## Note sul Contratto
Il contratto Solidity si trova in `contracts/TrendNFT.sol`. Dovrai compilarlo e deployarlo prima di poter usare l'agente. Puoi usare strumenti come Hardhat o Remix per il deploy.
