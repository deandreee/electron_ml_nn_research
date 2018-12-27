import * as fs from "fs";
import * as csv from "csv";
import { fromCb } from "./utils";

export const exists = async (fileName: string) => {
  return await fromCb(cb => fs.exists(fileName, cb));
};

export const appendVertical = async (fileName: string, row: number[]) => {
  const rows = row.map(x => [x]);
  let str = await fromCb(cb => csv.stringify(rows, cb));
  await fromCb(cb => fs.appendFile(fileName, str, cb));
};

export const append = async (fileName: string, row: (number | string)[]) => {
  let str = await fromCb(cb => csv.stringify([row], cb));
  await fromCb(cb => fs.appendFile(fileName, str, cb));
};
