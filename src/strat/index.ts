import { runBatchedXG } from "./run/runBatchedXG";

export const run = async () => {
  try {
    // return await runXG();
    // return await runXG_UI();
    return await runBatchedXG();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
