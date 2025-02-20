import * as fs from "fs";
import * as path from "path";
import { refundableTxs } from "./dataOutput/refundableTxs";

const directoryPath = path.join(__dirname, "dataOutput");

function generateReports(): void {
  generateMultisigTx();
  generateReport();
}

const generateReport = () => {
  const filePath = path.join(directoryPath, "refundableMultisigReport.csv");
  // Ensure the directory exists
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  // CSV Header
  const headers = ["extrinsic_id", "recipient", "amount", "refundableMethod"];

  // Format data into CSV rows
  const csvRows = refundableTxs.map((tx) => [
    tx.extrinsic_id,
    tx.recipient,
    tx.amount ?? "0", // Default to "0" if null
    tx.refundableMethod,
  ]);

  // Convert to CSV string
  const csvString = [
    headers.join(","),
    ...csvRows.map((row) => row.join(",")),
  ].join("\n");

  // Write to file
  fs.writeFileSync(filePath, csvString, "utf8");
  console.log(`✅ CSV file saved at: ${filePath}`);
};

const generateMultisigTx = () => {
  const filePath = path.join(directoryPath, "refundableMultisig.csv");

  // Ensure the directory exists
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  // CSV Header
  const headers = ["Recipient", "Amount"];

  // Format data into CSV rows
  const csvRows = refundableTxs.map((tx) => [
    tx.recipient,
    tx.amount ?? "0", // Default to "0" if null
  ]);

  // Convert to CSV string
  const csvString = [
    headers.join(","),
    ...csvRows.map((row) => row.join(",")),
  ].join("\n");

  // Write to file
  fs.writeFileSync(filePath, csvString, "utf8");
  console.log(
    `✅ CSV file saved at: ${filePath}, with ${refundableTxs.length} rows.`
  );
};

generateReports();
