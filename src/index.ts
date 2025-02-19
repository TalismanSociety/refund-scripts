import { config } from "dotenv";

import { ApiPromise, WsProvider } from "@polkadot/api";

// Load environment variables
config();

const endpoint = `wss://bittensor-finney.api.onfinality.io/ws?apikey=${process.env.ON_FINALITY_API_KEY}`;

async function main() {
  // Connect to a Polkadot node
  const wsProvider = new WsProvider(endpoint);
  const api = await ApiPromise.create({ provider: wsProvider });

  // Retrieve and display chain information
  const chain = await api.rpc.system.chain();
  const lastHeader = await api.rpc.chain.getHeader();

  console.log(`Connected to chain: ${chain}`);
  console.log(`Last block number: ${lastHeader.number}`);
}

main().catch(console.error);
