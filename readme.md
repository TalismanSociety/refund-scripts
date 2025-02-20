# Refundable Transactions CSV Generator

This project processes an array of `RefundableTransaction` objects, formats them as CSV, and saves the file locally.

## Setup

Add environment variables.

```sh
ON_FINALITY_API_KEY=
```

## 📥 Installation

1. **Clone the repository**

```sh
git clone git@github.com:TalismanSociety/refund-scripts.git
cd refund-scripts
```

2. Install dependencies

```sh
npm install
```

3. Get Data for coldkey

- Get the data for an account coldkey and date range from taostats api https://docs.taostats.io/reference/get-coldkey-report-1
- Add data to `coldKeyReport.ts`

4. Run script to parse coldKeyReport data and fetch extrinsic data.

   ```sh
   npm start
   ```

5. Run scripts to generate csv files:
   ```sh
   npm run generate
   ```

- Create a new multisend transaction in https://polkadotmultisig.com using the `refundableMultisig.csv` generate.
- Cross reference `refundableMultisigReport.csv` extrinsic ids with data from a chain explorer:
  https://taostats.io/extrinsic/[EXTRINSIC_ID]?network=finney
