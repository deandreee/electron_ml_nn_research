import { pad } from "lodash";
import { round2 } from "./utils";

const PAD_LENGTH = 90;

export const line = (s: string) => {
  console.log(pad(`  ${s} `, PAD_LENGTH, "="));
};

export const start = (name: string, noThrow?: boolean) => {
  time(name, noThrow);
  console.log(pad(` RUNNING ${name} `, PAD_LENGTH, "="));
};

export const end = (name: string, noThrow?: boolean) => {
  timeEnd(name, noThrow);
};

const times: { [name: string]: number } = {};
export const time = (name: string, noThrow?: boolean) => {
  if (times[name] && !noThrow) {
    throw new Error(`Time for ${name} already running`);
  }

  times[name] = new Date().getTime();
};

export const timeEnd = (name: string, noThrow?: boolean) => {
  const start = times[name];
  if (!start && !noThrow) {
    throw new Error(`Start time for ${name} not found`);
  }

  delete times[name];

  const end = new Date().getTime();

  const elapsedSeconds = round2((end - start) / 1000);
  console.log(pad(`  TIME ${name}:     [${elapsedSeconds}s]  `, PAD_LENGTH, "="));
};
