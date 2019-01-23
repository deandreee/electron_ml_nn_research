import * as Genetic from "@glavin001/genetic-js";
import { Population } from "@glavin001/genetic-js/dist/src/Selection";
import { Stats, GeneticState, Configuration } from "@glavin001/genetic-js";
import * as log from "../log";

export interface GA_Kalman {
  [prop: string]: number;

  R: number;
  Q: number;
  B: number;
  A: number;
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

type FnFitness = (entity: GA_Kalman) => Promise<number>;
type Random5050 = 0 | 1;

interface RunConfigXGOpts {
  [x: string]: number[];
}

// https://www.wouterbulten.nl/blog/tech/lightweight-javascript-library-for-noise-filtering/
export const runConfigXGOpts: RunConfigXGOpts = {
  R: [0.01, 0.02, 0.05, 0.1],
  Q: [1, 2, 3, 5, 10, 20],
  B: [1, 2, 3, 5, 10, 20],
  A: [1, 1.1, 1.2, 1.3, 1.5, 1.8, 2]
};

// Extend the abstract class Genetic.Genetic
export class GeneticKalman extends Genetic.Genetic<GA_Kalman, UserData> {
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
    population: Population<GA_Kalman>;
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

  shouldContinue(state: GeneticState<GA_Kalman>) {
    return true;
  }

  random5050(): Random5050 {
    if (Math.random() >= 0.5) {
      return 1;
    }
    return 0;
  }

  createChild(mother: GA_Kalman, father: GA_Kalman): GA_Kalman {
    const child = this.emptyDefault();

    child.R = this.random5050() === 1 ? mother.R : father.R;
    child.Q = this.random5050() === 1 ? mother.Q : father.Q;
    child.B = this.random5050() === 1 ? mother.B : father.B;
    child.A = this.random5050() === 1 ? mother.A : father.A;

    return child;
  }

  crossover(mother: GA_Kalman, father: GA_Kalman) {
    const child1 = this.createChild(mother, father);
    const child2 = this.createChild(mother, father);

    return [child1, child2] as [GA_Kalman, GA_Kalman];
  }

  emptyDefault() {
    return {
      idx: this.idx++,
      R: -1,
      Q: -1,
      B: -1,
      A: -1
    };
  }

  async fitness(entity: GA_Kalman) {
    return this.fnFitness(entity);
  }

  getMutableProps(entity: GA_Kalman) {
    return Object.keys(entity).filter(x => x !== "idx");
  }

  mutate(entity: GA_Kalman) {
    entity.idx = this.idx++;

    this.setRandomProp(entity);
    this.setRandomProp(entity);

    return entity;
  }

  setRandomProp(entity: GA_Kalman) {
    const props = this.getMutableProps(entity);
    const prop1 = takeRandomStr(props) as string;
    entity[prop1] = takeRandom(runConfigXGOpts[prop1]) as number;
  }

  seed() {
    return {
      idx: this.idx++,
      R: takeRandom(runConfigXGOpts.R),
      Q: takeRandom(runConfigXGOpts.Q),
      B: takeRandom(runConfigXGOpts.B),
      A: takeRandom(runConfigXGOpts.A)
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
