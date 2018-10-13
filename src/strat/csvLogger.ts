import * as fs from "fs";
import * as csv from "csv";
import { MlEvaluateResults } from "./mlEvaluate";
import { fromCb, round2 } from "./utils";

export const writeHeader = async (fileName: string) => {
  let columns = ["date", "res/pr", "res/rc", "res/fs"];

  let data = [columns];
  let str = await fromCb(cb => csv.stringify(data, cb));
  await fromCb(cb => fs.appendFile(fileName, str, cb));
};

interface AppendProps {
  results: MlEvaluateResults;
  results3s: MlEvaluateResults;
  results5s: MlEvaluateResults;
}

export const append = async (
  fileName: string,
  daterange: string,
  target: string,
  featureName: string,
  props: AppendProps
) => {
  let row = [
    new Date().toISOString(),
    daterange,
    target,
    featureName,

    round2(props.results.precisionTotal),
    round2(props.results.recallTotal),
    round2(props.results.fScore),

    round2(props.results3s.precisionTotal),
    round2(props.results3s.recallTotal),
    round2(props.results3s.fScore),

    round2(props.results5s.precisionTotal),
    round2(props.results5s.recallTotal),
    round2(props.results5s.fScore)
  ];

  let str = await fromCb(cb => csv.stringify([row], cb));

  await fromCb(cb => fs.appendFile(fileName, str, cb));
};

export const appendReg = async (
  fileName: string,
  daterange: string,
  target: string,
  featureName: string,
  gamma: number,
  cost: number,
  mse: number,
  r2: number
) => {
  let row = [new Date().toISOString(), daterange, target, featureName, gamma, cost, round2(mse), round2(r2)];
  let str = await fromCb(cb => csv.stringify([row], cb));
  await fromCb(cb => fs.appendFile(fileName, str, cb));
};
