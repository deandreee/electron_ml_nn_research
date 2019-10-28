// import { runBatchedXG as runn } from "./run/runBatchedXG";
// import { runBatchedLSTM as runn } from "./run/runBatchedLSTM";
// import { runBatchedXG  as runn } from "./run/runBatchedXG_wConfigGrid";
// import { runBatchedXG as runn } from "./run/runBatchedXG_wGA";
// import { runBatchedXG as runn } from "./run/runBatchedXG_all";
// import { runIndProb as runn } from "./run/runIndProb";
// import { runBatchedXG as runn } from "./run/runBatchedXG_wGA_single";
// import { runRL as runn } from "./run/runRL";
import { runSVM as runn } from "./run/runSVM";

export const run = async () => {
  try {
    return await runn();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
