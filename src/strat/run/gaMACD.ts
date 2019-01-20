import * as Genetic from "@glavin001/genetic-js";
import { Population } from "@glavin001/genetic-js/dist/src/Selection";
import { Stats, GeneticState, Configuration } from "@glavin001/genetic-js";

export interface GA_MACD {
  [prop: string]: number;

  idx: number;
  long: number;
  short: number;
  signal: number;
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

type FnFitness = (entity: GA_MACD) => Promise<number>;
type Random5050 = 0 | 1;

interface RunConfigXGOpts {
  [x: string]: number[];
}

export const runConfigXGOpts: RunConfigXGOpts = {
  short: [2, 5, 7, 9, 12, 15, 20, 25, 30],
  long: [25, 30, 35, 40, 45, 50],
  signal: [2, 5, 7, 9, 12, 15, 20, 25, 30]
};

// Extend the abstract class Genetic.Genetic
export class GeneticMACD extends Genetic.Genetic<GA_MACD, UserData> {
  fnFitness: FnFitness;
  idx: number;

  constructor(configuration: Partial<Configuration>, userData: UserData, fnFitness: FnFitness) {
    super(configuration, userData);
    this.fnFitness = fnFitness;
    this.idx = 0;
  }

  // more likely allows the most fit individuals to survive between generations
  public select1 = Genetic.Select1.RandomLinearRank;
  // always mates the most fit individual with random individuals
  public select2 = Genetic.Select2.FittestRandom;

  public notification({
    population: pop,
    isFinished
  }: {
    population: Population<GA_MACD>;
    generation: number;
    stats: Stats;
    isFinished: boolean;
  }) {
    if (isFinished) {
      console.log(`Solution is ${pop[0].entity.eta}`);
    }
  }

  public optimize = Genetic.Optimize.Maximize;

  shouldContinue(state: GeneticState<GA_MACD>) {
    return true;
  }

  random5050(): Random5050 {
    if (Math.random() >= 0.5) {
      return 1;
    }
    return 0;
  }

  createChild(mother: GA_MACD, father: GA_MACD): GA_MACD {
    const child = this.emptyDefault();

    child.short = this.random5050() === 1 ? mother.short : father.short;
    child.long = this.random5050() === 1 ? mother.long : father.long;
    child.signal = this.random5050() === 1 ? mother.signal : father.signal;

    return child;
  }

  crossover(mother: GA_MACD, father: GA_MACD) {
    const child1 = this.createChild(mother, father);
    const child2 = this.createChild(mother, father);

    return [child1, child2] as [GA_MACD, GA_MACD];
  }

  emptyDefault() {
    return {
      idx: this.idx++,
      short: -1,
      long: -1,
      signal: -1
    };
  }

  async fitness(entity: GA_MACD) {
    return this.fnFitness(entity);
  }

  getMutableProps(entity: GA_MACD) {
    return Object.keys(entity).filter(x => x !== "idx");
  }

  mutate(entity: GA_MACD) {
    entity.idx = this.idx++;

    this.setRandomProp(entity);
    this.setRandomProp(entity);

    return entity;
  }

  setRandomProp(entity: GA_MACD) {
    const props = this.getMutableProps(entity);
    const prop1 = takeRandomStr(props) as string;
    entity[prop1] = takeRandom(runConfigXGOpts[prop1]) as number;
  }

  seed() {
    return {
      idx: this.idx++,
      short: takeRandom(runConfigXGOpts.short),
      long: takeRandom(runConfigXGOpts.long),
      signal: takeRandom(runConfigXGOpts.signal)
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
