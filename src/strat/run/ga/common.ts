import * as Genetic from "@glavin001/genetic-js";
import { RunConfigXG } from "../runConfigXG";

export const takeRandom = (arr: GAProp[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const takeRandomStr = (arr: string[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export interface UserData {
  solution: string;
}

// let's keep that one typed version for XG specifically
export type FnFitness = (entity: RunConfigXG | GAEntity) => Promise<number>;
export type FnNotification = (genIdx: number) => void;

export type Random5050 = 0 | 1;

export const userData: UserData = {
  solution: "whatever"
};

export const gaConfig: Partial<Genetic.Configuration> = {
  crossover: 0.4,
  iterations: 2000,
  mutation: 0.3,
  size: 20
};

export type GAProp = string | number | boolean;

// single
export interface GAEntity {
  [x: string]: GAProp;
}

// options
export interface GAOpts {
  [x: string]: GAProp[];
}

export const random5050 = (): Random5050 => {
  if (Math.random() >= 0.5) {
    return 1;
  }
  return 0;
};
