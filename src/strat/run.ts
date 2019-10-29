// import { runBatchedXG as runn } from "./run/runBatchedXG";
// import { runBatchedLSTM as runn } from "./run/runBatchedLSTM";
// import { runBatchedXG as runn } from "./run/runBatchedXG_wConfigGrid";
import { runBatchedXG as runn } from "./run/runBatchedXG_all";
// import { runBatchedXG as runn } from "./run/runBatchedXG_wGA";

// import { runIndProb as runn } from "./run/runIndProb";

// import { runSVM as runn } from "./run/runSVM";
// import { runRL as runn } from "./run/runRL";

export const run = async () => {
  try {
    return await runn();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
