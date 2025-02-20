export type RefundableTransaction = {
  extrinsic_id: string;
  recipient: string;
  amount: string | null;
  refundableMethod: string;
};
