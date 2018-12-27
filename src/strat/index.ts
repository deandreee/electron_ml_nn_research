import { runBatchedXG } from "./run/runBatchedXG";
// import { runBatchedLSTM } from "./run/runBatchedLSTM";

export const run = async () => {
  try {
    // return await runXG();
    // return await runXG_UI();
    return await runBatchedXG();
    // return await runBatchedLSTM();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
