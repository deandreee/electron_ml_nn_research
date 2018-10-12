import * as fs from "fs";
import * as csv from "csv";
import { fromCb } from "./utils";

export const append = async (fileName: string, row: number[]) => {
  const rows = row.map(x => [x]);
  let str = await fromCb(cb => csv.stringify(rows, cb));
  await fromCb(cb => fs.appendFile(fileName, str, cb));
};
