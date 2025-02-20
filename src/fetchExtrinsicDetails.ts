import { ApiPromise } from "@polkadot/api";
import { type ColdKeyTransaction } from "../data/ColdKeyReport";
import * as fs from "fs";
import * as path from "path";
import { RefundableTransaction } from "./types";

const refundableMethods = ["addStake", "removeStake"];
const directoryPath = path.join(__dirname, "dataOutput");
const filePath = path.join(directoryPath, "refundableTxs.ts");

export async function fetchExtrinsicDetails(
  api: ApiPromise,
  extrinsics: ColdKeyTransaction[]
) {
  const refundableTxs: RefundableTransaction[] = [];
  for (const extrinsic of extrinsics) {
    console.log(`🔹 Fetching Data for Extrinsic: ${extrinsic.extrinsic_id}`);

    try {
      // Extract block number and extrinsic index
      const [blockNumberStr, indexStr] = extrinsic.extrinsic_id.split("-");
      const blockNumber = parseInt(blockNumberStr, 10);
      const extrinsicIndex = parseInt(indexStr, 10);

      // Get block hash
      const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
      const signedBlock = await api.rpc.chain.getBlock(blockHash);
      const events = await api.query.system.events.at(blockHash);

      // Retrieve the extrinsic
      const extrinsicsInBlock = signedBlock.block.extrinsics;

      if (extrinsicIndex >= extrinsicsInBlock.length) {
        console.warn(
          `❗ Extrinsic index ${extrinsicIndex} out of range in block ${blockNumber}`
        );
        continue;
      }

      const chainExtrinsic = extrinsicsInBlock[extrinsicIndex];

      // ✅ Ensure it's a batch transaction
      if (
        !(
          chainExtrinsic.method.section === "utility" &&
          (chainExtrinsic.method.method === "batch" ||
            chainExtrinsic.method.method === "batchAll")
        )
      ) {
        console.warn(
          `❗ Skipping extrinsic ${extrinsic.extrinsic_id}: Not a batch transaction`
        );
        continue;
      }

      // ✅ Extract batch calls from arguments
      const batchCalls = chainExtrinsic.method.args[0].toJSON();

      // @ts-ignore
      const callKinds = batchCalls?.map((call: any) => {
        const decodedCall = api.findCall(call.callIndex);
        return {
          __kind: decodedCall.section, // Module (e.g., "Balances", "SubtensorModule")
          method: decodedCall.method, // Method (e.g., "transfer", "remove_stake_limit")
        };
      });

      const refundableMethod = callKinds.find((call: any) =>
        refundableMethods.includes(call.method)
      );
      const signer = chainExtrinsic.signer.toString();

      if (refundableMethod) {
        refundableTxs.push({
          extrinsic_id: extrinsic.extrinsic_id,
          recipient: signer,
          amount: extrinsic.credit_amount,
          refundableMethod: refundableMethod.method,
        });
      }
    } catch (error) {
      console.error(
        `❌ Error fetching data for extrinsic ${extrinsic.extrinsic_id}:`,
        error
      );
    }

    await writeToFile(refundableTxs);
  }
}

function writeToFile(refundableTxs: RefundableTransaction[]): void {
  const content = `export const refundableTxs = ${JSON.stringify(
    refundableTxs,
    null,
    2
  )} as const;\n`;

  // Ensure the directory exists
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`File written successfully to ${filePath}`);
}
