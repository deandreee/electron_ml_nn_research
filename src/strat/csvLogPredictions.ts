import * as fs from "fs";
import * as csv from "csv";
import { fromCb, round1 } from "./utils";

export const append = async (fileName: string, labels: number[], predicted: number[]) => {
  let rows = labels.map((x, i) => [round1(labels[i]), round1(predicted[i])]);
  let str = await fromCb(cb => csv.stringify(rows, cb));
  await fromCb(cb => fs.appendFile(fileName, str, cb));
};
