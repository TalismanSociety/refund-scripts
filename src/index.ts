import { ApiPromise, WsProvider } from "@polkadot/api";

async function main() {
  // Connect to a Polkadot node
  const wsProvider = new WsProvider("wss://rpc.polkadot.io");
  const api = await ApiPromise.create({ provider: wsProvider });

  // Retrieve and display chain information
  const chain = await api.rpc.system.chain();
  const lastHeader = await api.rpc.chain.getHeader();

  console.log(`Connected to chain: ${chain}`);
  console.log(`Last block number: ${lastHeader.number}`);
}

main().catch(console.error);
