import * as regression from "regression";
import * as mlUtils from "./mlUtils";
import * as mlEvaluate from "./mlEvaluate";
import { FnGetFeature } from "../features";
import { CorrCandles } from "../corr/CorrCandles";
import { round2 } from "../utils";
import * as csvLog from "../csvLog";

const getLabels = (corrCandles: CorrCandles) => {
  return corrCandles.candlesActual.map(x => x.pctChange._1d);
};

export const predict = async (corrCandles: CorrCandles, fnGetFeature: FnGetFeature) => {
  // in this case features in 1d array !!!
  let features2d = corrCandles.candlesActual.map((x, i) => fnGetFeature(x, i, corrCandles));
  let labels = getLabels(corrCandles);
  let features = mlUtils.rescaleRow(features2d.map(x => x[0]));
  labels = labels.map(x => round2(x));

  mlUtils.sanityCheckRow(features);
  mlUtils.sanityCheckRow(labels);

  const data = features.map((x, i) => [x, labels[i]]);
  const lr = regression.linear(data);
  const lrModelR2 = lr.r2;
  const predicted = (features.map(lr.predict) as number[][]).map(x => x[1]);

  const { mse } = mlEvaluate.evalRegMSE(labels, predicted);
  const { r2 } = mlEvaluate.evalRegR2(labels, predicted);

  await csvLog.append("output/ml_lr.csv", [24, round2(lrModelR2), round2(mse), round2(r2)]);

  return { labels, predicted, mse, r2, lrModelR2 };
};
