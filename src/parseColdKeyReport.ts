import { coldKeyReport, type ColdKeyTransaction } from "../data/ColdKeyReport";

export const parseColdKeyReport = (): ColdKeyTransaction[] => {
  return coldKeyReport.filter(
    (tx) =>
      tx.transaction_type === "transfer_in" &&
      !!tx.credit_amount &&
      Number(tx.credit_amount) > 0 &&
      tx.extrinsic_id
  );
};
