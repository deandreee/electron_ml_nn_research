import { runConfigXGOpts, RunConfigXG } from "./runConfigXG";
import * as Genetic from "@glavin001/genetic-js";
import { Population } from "@glavin001/genetic-js/dist/src/Selection";
import { Stats, GeneticState, Configuration } from "@glavin001/genetic-js";

const takeRandom = (arr: number[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const takeRandomStr = (arr: string[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

interface UserData {
  solution: string;
}

type FnFitness = (entity: RunConfigXG) => Promise<number>;
type Random5050 = 0 | 1;

// Extend the abstract class Genetic.Genetic
export class CustomGenetic extends Genetic.Genetic<RunConfigXG, UserData> {
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
    population: Population<RunConfigXG>;
    generation: number;
    stats: Stats;
    isFinished: boolean;
  }) {
    if (isFinished) {
      console.log(`Solution is ${pop[0].entity.eta}`);
    }
  }

  public optimize = Genetic.Optimize.Maximize;

  shouldContinue(state: GeneticState<RunConfigXG>) {
    return true;
  }

  random5050(): Random5050 {
    if (Math.random() >= 0.5) {
      return 1;
    }
    return 0;
  }

  createChild(mother: RunConfigXG, father: RunConfigXG): RunConfigXG {
    const child = this.emptyDefault();

    child.eta = this.random5050() === 1 ? mother.eta : father.eta;
    child.gamma = this.random5050() === 1 ? mother.gamma : father.gamma;
    child.max_depth = this.random5050() === 1 ? mother.max_depth : father.max_depth;
    child.min_child_weight = this.random5050() === 1 ? mother.min_child_weight : father.min_child_weight;
    child.subsample = this.random5050() === 1 ? mother.subsample : father.subsample;
    child.iterations = this.random5050() === 1 ? mother.iterations : father.iterations;

    return child;
  }

  crossover(mother: RunConfigXG, father: RunConfigXG) {
    const child1 = this.createChild(mother, father);
    const child2 = this.createChild(mother, father);

    return [child1, child2] as [RunConfigXG, RunConfigXG];
  }

  emptyDefault() {
    return {
      idx: this.idx++,
      eta: -1,
      gamma: -1,
      max_depth: -1,
      min_child_weight: -1,
      subsample: -1,
      iterations: -1
    };
  }

  async fitness(entity: RunConfigXG) {
    return this.fnFitness(entity);
  }

  getMutableProps(entity: RunConfigXG) {
    return Object.keys(entity).filter(x => x !== "idx");
  }

  mutate(entity: RunConfigXG) {
    entity.idx = this.idx++;

    this.setRandomProp(entity);
    this.setRandomProp(entity);

    return entity;
  }

  setRandomProp(entity: RunConfigXG) {
    const props = this.getMutableProps(entity);
    const prop1 = takeRandomStr(props) as string;
    entity[prop1] = takeRandom(runConfigXGOpts[prop1]) as number;
  }

  seed() {
    return {
      idx: this.idx++,
      eta: takeRandom(runConfigXGOpts.eta),
      gamma: takeRandom(runConfigXGOpts.gamma),
      max_depth: takeRandom(runConfigXGOpts.max_depth),
      min_child_weight: takeRandom(runConfigXGOpts.min_child_weight),
      subsample: takeRandom(runConfigXGOpts.subsample),
      iterations: takeRandom(runConfigXGOpts.iterations)
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
