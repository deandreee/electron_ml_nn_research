// import { runBatchedXG as runn } from "./run/runBatchedXG";
// import { runBatchedLSTM  as runn } from "./run/runBatchedLSTM";
// import { runBatchedXG  as runn } from "./run/runBatchedXG_wConfigGrid";
import { runBatchedXG as runn } from "./run/runBatchedXG_wGA";
// import { runBatchedXG  as runn } from "./run/runBatchedXG_all";
// import { runIndProb as runn } from "./run/runIndProb";

export const run = async () => {
  try {
    return await runn();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
