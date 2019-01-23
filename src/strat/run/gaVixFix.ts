import * as Genetic from "@glavin001/genetic-js";
import { Population } from "@glavin001/genetic-js/dist/src/Selection";
import { Stats, GeneticState, Configuration } from "@glavin001/genetic-js";
import * as log from "../log";

export interface GA_VixFix {
  [prop: string]: number;

  pd: number;
  bbl: number;
  mult: number;
  lb: number;
  ph: number;
}

const takeRandom = (arr: number[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const takeRandomStr = (arr: string[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

interface UserData {
  solution: string;
}

type FnFitness = (entity: GA_VixFix) => Promise<number>;
type Random5050 = 0 | 1;

interface RunConfigXGOpts {
  [x: string]: number[];
}

// https://www.wouterbulten.nl/blog/tech/lightweight-javascript-library-for-noise-filtering/
export const runConfigXGOpts: RunConfigXGOpts = {
  pd: [10, 15, 22, 25, 30],
  bbl: [10, 15, 22, 25, 30],
  mult: [1, 1.5, 2, 2.5, 3, 4],
  lb: [30, 40, 50, 60, 70, 80, 90],
  ph: [0.7, 0.75, 0.8, 0.85, 0.9, 0.95]
};

// Extend the abstract class Genetic.Genetic
export class GeneticVixFix extends Genetic.Genetic<GA_VixFix, UserData> {
  fnFitness: FnFitness;
  idx: number;
  genIdx: number;

  constructor(configuration: Partial<Configuration>, userData: UserData, fnFitness: FnFitness) {
    super(configuration, userData);
    this.fnFitness = fnFitness;
    this.idx = 0;
    this.genIdx = 0;
  }

  // more likely allows the most fit individuals to survive between generations
  public select1 = Genetic.Select1.RandomLinearRank;
  // always mates the most fit individual with random individuals
  public select2 = Genetic.Select2.FittestRandom;

  public notification({
    population: pop,
    isFinished
  }: {
    population: Population<GA_VixFix>;
    generation: number;
    stats: Stats;
    isFinished: boolean;
  }) {
    if (isFinished) {
      console.log(`Solution is ${pop[0].entity.eta}`);
    }
    log.line(`FINISHED GEN ${this.genIdx++}`);
  }

  public optimize = Genetic.Optimize.Maximize;

  shouldContinue(state: GeneticState<GA_VixFix>) {
    return true;
  }

  random5050(): Random5050 {
    if (Math.random() >= 0.5) {
      return 1;
    }
    return 0;
  }

  createChild(mother: GA_VixFix, father: GA_VixFix): GA_VixFix {
    const child = this.emptyDefault();

    child.pd = this.random5050() === 1 ? mother.pd : father.pd;
    child.bbl = this.random5050() === 1 ? mother.bbl : father.bbl;
    child.mult = this.random5050() === 1 ? mother.mult : father.mult;
    child.lb = this.random5050() === 1 ? mother.lb : father.lb;
    child.ph = this.random5050() === 1 ? mother.ph : father.ph;

    return child;
  }

  crossover(mother: GA_VixFix, father: GA_VixFix) {
    const child1 = this.createChild(mother, father);
    const child2 = this.createChild(mother, father);

    return [child1, child2] as [GA_VixFix, GA_VixFix];
  }

  emptyDefault() {
    return {
      idx: this.idx++,
      pd: -1,
      bbl: -1,
      mult: -1,
      lb: -1,
      ph: -1
    };
  }

  async fitness(entity: GA_VixFix) {
    return this.fnFitness(entity);
  }

  getMutableProps(entity: GA_VixFix) {
    return Object.keys(entity).filter(x => x !== "idx");
  }

  mutate(entity: GA_VixFix) {
    entity.idx = this.idx++;

    this.setRandomProp(entity);
    this.setRandomProp(entity);

    return entity;
  }

  setRandomProp(entity: GA_VixFix) {
    const props = this.getMutableProps(entity);
    const prop1 = takeRandomStr(props) as string;
    entity[prop1] = takeRandom(runConfigXGOpts[prop1]) as number;
  }

  seed() {
    return {
      idx: this.idx++,
      pd: takeRandom(runConfigXGOpts.pd),
      bbl: takeRandom(runConfigXGOpts.bbl),
      mult: takeRandom(runConfigXGOpts.mult),
      lb: takeRandom(runConfigXGOpts.lb),
      ph: takeRandom(runConfigXGOpts.ph)
    };
  }
}

export const userData: UserData = {
  solution: "whatever"
};

export const gaConfig: Partial<Genetic.Configuration> = {
  crossover: 0.4,
  iterations: 2000,
  mutation: 0.3,
  size: 20
};
