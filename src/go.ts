// @ts-ignore
import { run } from "./strat/run";
// import { config } from "./strat/config";
// @ts-ignore
// import { marketMonth } from "./tools/marketMonth";
import { barrierLabels } from "./tools/barrierLabels";

export const wrapTool = async () => {
  try {
    // marketMonth();
    await barrierLabels();
  } catch (err) {
    console.error(err);
    console.log(err.stack);
  }
};

try {
  run();
  // wrapTool();
} catch (err) {
  console.error(err);
}
